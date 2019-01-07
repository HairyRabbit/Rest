/**
 * task manager
 */

import path from 'path'
import Task, { TaskInterface, TaskConstructor, TaskState, TaskResult } from './tasker'
import { forEachParallel, forEachMapParallel } from './utils'
import MakeDir from './modules/mkdir';

/// code

export type TaskStack = Set<TaskInterface<any>>

export interface TaskBox {
  id: number
  counter: number
  validated?: boolean
  during?: number
  task: TaskInterface<any>,
  issues: Set<TaskBox>
}

function makeTaskBox<T>(id: number, task: TaskInterface<T>): TaskBox {
  return {
    id,
    task,
    counter: 0,
    validated: false,
    issues: new Set()
  }
}

export type TaskMap = Map<string, TaskBox>
export const enum TaskManagerState { Init, Start, Validate, Run, Rollback }
export const enum TaskManagerResult { Done, Fail }

export interface TaskManagerInterface {
  tasks: TaskMap
  stack: TaskStack
  state: TaskManagerState
  result?: TaskManagerResult 
  validate(): Promise<void>
  run(): Promise<void>
}

export interface TaskManagerConstructor {
  new(tasklist: Array<TaskConstructor<any>>): TaskManagerInterface
}

function getNextTasks(taskmap: TaskMap): Set<TaskBox> {
  const acc: Set<TaskBox> = new Set()
  taskmap.forEach(value => {
    if(0 === value.counter) acc.add(value)
  })
  return acc
}

function setTaskCounter(tasks: TaskMap, task: TaskInterface<any>): void {
  tasks.forEach(box => {
    if(box.task === task) return
    if(box.task.dependencies.has(task)) box.counter -= 1
  })
}

export type TaskError = { task: TaskInterface<any>, error: Error }
export class TaskManager implements TaskManagerInterface {
  public context!: string
  public state: TaskManagerState = TaskManagerState.Init
  public result?: TaskManagerResult
  public tasks: TaskMap = new Map()
  public stack: TaskStack = new Set()
  public validateErrors: Set<TaskError> = new Set()
  public runErrors: Set<TaskError> = new Set()
  public rollbackErrors: Set<TaskError> = new Set()
  public exit!: (code?: number | undefined) => never;
  public errors: Set<{ box: TaskBox, error: Error}> = new Set();

  constructor(public tasklist: Array<[TaskConstructor<any>, any]>, context?: string) {
    if(!context) {
      this.context = process.cwd()
    } else if(!path.isAbsolute(context)) {
      this.context = path.normalize(context)
    } else {
      this.context = context
    }
  }

  /**
   * init tasks
   */
  async init(): Promise<void> {
    /**
     * if context dir was not exists, add `mkdir(this.context)` 
     * before all the tasks.
     */
    const contextTask = new MakeDir(this.context, { dirpath: this.context })

    await forEachParallel(async ([Task, options]) => {
      const task = new Task(this.context, options)
      const box: TaskBox = makeTaskBox(this.tasks.size + 1, task)
      this.tasks.set(task.id, box)
      task.dependencies.add(contextTask)
    }, this.tasklist)

    /**
     * clean up, no more need `tasklist`
     */
    delete this.tasklist
  }

  /**
   * after `task.validate()`, wrap every task's dependency into task box,
   * and add to `this.tasks`, until all tasks were validated
   */
  async validate(): Promise<void> {
    let next: boolean = false

    for await (const [id, box] of this.tasks) {
      if(box.validated) return
      const task = box.task
      try {
        await task.validate()
      } catch(e) {
        this.errors.add({ box, error: new Error(e) })
        task.result = TaskResult.Fail
      }
      
      task.state = TaskState.Validate
      task.dependencies.forEach(deptask => {
        /**
         * find deptask from `this.tasks` by `deptask.id`,
         * if not found, create new one and add to `this.tasks`;
         * if exists, check the validated, `false` means the box
         * should validate at next loop.
         */
        const depbox: undefined | TaskBox = this.tasks.get(deptask.id)
        if(!depbox) {
          const newbox = makeTaskBox(this.tasks.size + 1, deptask)
          newbox.issues.add(box)
          this.tasks.set(deptask.id, newbox)
          box.counter += 1
          next = true
        } else {          
          /**
           * link `depbox.issues` with `box`
           */
          if(!depbox.issues.has(box)) {
            depbox.issues.add(box)
            box.counter += 1
          }

          /**
           * replace refs when got same id
           */
          if(depbox.task !== deptask) {
            task.dependencies.delete(deptask)
            task.dependencies.add(depbox.task)
          }
        }
      })
      box.validated = true
    }

    if(next) await this.validate()
  }

  async run(): Promise<void> {
    const nextTasks: Set<TaskBox> = getNextTasks(this.tasks)
    // console.log(require('util').inspect(nextTasks, { depth: null }))
    // console.log(nextTasks)
    /**
     * done, no more tasks need to run
     */
    if(!nextTasks.size) return

    /**
     * run tasks pall
     */
    await Promise.all(Array.from(nextTasks).map(async t => {
      const { task } = t
      try {
        const beg: number = Date.now()
        task.state = TaskState.Run
        await task.run()
        task.state = TaskState.Complate
        if(!task.result) task.result = TaskResult.Done
        t.during = Date.now() - beg
        t.counter = -1
        this.stack.add(task)
        setTaskCounter(this.tasks, task)
      } catch(e) {
        /**
         * task failed, collect errors and ready do rollback
         */
        this.runErrors.add({
          task,
          error: new Error(e)
        })
        task.state = TaskState.Complate
        if(!task.result) task.result = TaskResult.Fail
      }
    }))
    
    if(this.runErrors.size) return
    return this.run()
  }
  
  async rollback(): Promise<void> {
    for await (const task of this.stack) {
      try {
        task.result = undefined
        await task.rollback()
      } catch(e) {
        this.rollbackErrors.add({
          task,
          error: new Error(e)
        })
      }
    }
  }

  async start(handler: () => void): Promise<void> {
    this.exit = exit(handler)
    /**
     * initial all tasks
     */
    this.state = TaskManagerState.Start
    await this.init()

    /**
     * validate tasks
     */
    this.state = TaskManagerState.Validate
    await this.validate() 
    //console.log('VALIDATED DONE', require('util').inspect(this.tasks, { depth: null }))
    //console.log('VALIDATED DONE', this.tasks)
    
    /**
     * validate failed, stop run task and exit
     */
    if(this.errors.size) {
      this.result = TaskManagerResult.Fail
      console.log('')
      this.exit(2)
      return
    }

    /**
     * run task recur
     */
    this.state = TaskManagerState.Run
    await this.run()

    /**
     * run tasks successful
     */
    if(!this.runErrors.size) {
      // console.log('DONE', this)
      //console.log('DONE', require('util').inspect(this.tasks, { depth: null }))
      //console.log(Array.from(this.runErrors))
      this.result = TaskManagerResult.Done
      return
    }

    /**
     * run rollback
     */
    await this.rollback()

    /**
     * rollback failed
     */
    if(this.rollbackErrors.size) {
      console.log(Array.from(this.rollbackErrors))
    }
  }
}

function exit(f: () => void) {
  return (code?: number) => {
    f()
    setTimeout(() => process.exit(code), 500)
  }
}

async function taskStateMachine(taskManager: TaskManager): Promise<void> {
  switch(taskManager.state) {
    case TaskManagerState.Init: {
      await taskManager.start()
      break
    }

    case TaskManagerState.Start: {
      await taskManager.validate()
      break
    }

    case TaskManagerState.Validate: {
      await taskManager.run()
      break
    }

    case TaskManagerState.Run: {
      await taskManager.run()
      break
    }

    case TaskManagerState.Rollback: {
      await taskManager.rollback()
      break
    }

    default: throw new Error(
      `Unknown task state "${taskManager.state}"`
    )
  }

  return taskStateMachine(taskManager)
}

export default function taskManager<T extends [TaskConstructor<T>, T]>(tasklist: { [K in keyof T]: T[K] }, context?: string): TaskManager {
  return new TaskManager(tasklist, context)
}

/**
 * task manager
 */

import path from 'path'
import Task, { TaskInterface, TaskConstructor, TaskState, TaskResult, TaskResultReturnType, TaskAction, TaskContext } from './tasker'
import { forEachParallel } from './utils'
import { isArray } from 'lodash';
import { isString } from 'util';

/// code

export type TaskStack = Set<TaskBox>

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

export interface TaskManagerInterface extends TaskManagerAction {
  tasks: TaskMap
  stack: TaskStack
  state: TaskManagerState
  result?: TaskManagerResult
}

interface TaskManagerAction {
  validate(): Promise<void>
  run(): Promise<void>
}

interface TaskManagerRendered {
  readonly id: string
  readonly name: string
  readonly state: TaskState
  readonly result?: TaskResult
  readonly description?: string
  readonly during?: number
  readonly depth: number
  readonly dynamic: boolean
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

const enum TaskManagerMessageType { Info, Warning, Error }

interface TaskManagerMessageRendered {
  id: string,
  name: string,
  type: TaskManagerMessageType,
  msg: string
}

export class TaskManager implements TaskManagerInterface {
  public state: TaskManagerState = TaskManagerState.Init
  public result?: TaskManagerResult
  public tasks: TaskMap = new Map()
  public stack: TaskStack = new Set()
  public validateErrors: Set<TaskError> = new Set()
  public runErrors: Set<TaskError> = new Set()
  public rollbackErrors: Set<TaskError> = new Set()
  public exit!: (code?: number | undefined) => void
  public errors: Set<{ box: TaskBox, error: Error}> = new Set()
  public messages: Set<{ box: TaskBox, msg: string, type: TaskManagerMessageType }> = new Set()
  constructor(public tasklist: Array<[TaskConstructor<any>, any, undefined | Array<string>]>, public context: TaskContext) {}

  /**
   * init tasks
   */
  async init(): Promise<void> {
    /**
     * if context dir was not exists, add `mkdir(this.context)` 
     * before all the tasks.
     */
    const depTaskMap: Map<string, Set<TaskBox>> = new Map()
    
    await forEachParallel(async ({ task, alias, deps }) => {
      if(!task.title) task.id = task.title
      const box: TaskBox = makeTaskBox(this.tasks.size + 1, task)
      if(deps) deps.forEach(dep => {
        const depset: undefined | Set<TaskBox> = depTaskMap.get(dep)
        if(depset) {
          depset.add(box)
        } else {
          depTaskMap.set(dep, new Set([ box ]))
        }
      })
      this.tasks.set(task.id, box)

      /**
       * task self and task's dependencies all are not dynamic
       */
      task.static = true
      task.dependencies.forEach(deptask => deptask.static = true)
    }, this.tasklist)

    /**
     * mount deps to each task box
     */
    depTaskMap.forEach((boxs, dep) => {
      boxs.forEach(box => {
        const depbox = this.tasks.get(dep)
        if(!depbox) throw new Error(`task not found "${dep}"`)
        box.task.dependencies.add(depbox.task)
        box.task.static = true
      })
    })

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
    let failed: boolean = false

    for await (const [id, box] of this.tasks) {
      if(box.validated) return
      if(failed) return
      
      const task = box.task

      /**
       * set task state and run `validate()`, then set result
       */
      task.state = TaskState.Validate
      try {
        /**
         * @todo add warning supports
         */
        const description = await task.validate()
        task.result = TaskResult.Done
        task.description = description || undefined

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
      } catch(e) {
        this.messages.add({ 
          type: TaskManagerMessageType.Error, 
          box, 
          msg: String(e)
        })
        task.result = TaskResult.Fail
        failed = true
      }
    }

    if(next) await this.validate()
    if(failed) throw 42
  }

  async run(): Promise<void> {
    const nextTasks: Set<TaskBox> = getNextTasks(this.tasks)
    /**
     * done, no more tasks need to run
     */
    if(!nextTasks.size) return

    /**
     * run tasks pall
     */
    await Promise.all(Array.from(nextTasks).map(async box => {
      const { task } = box

      task.state = TaskState.Run
      
      try {
        const beg: number = Date.now()

        const [ result, description ] = await runTaskAction(task.run.bind(task))
        task.result = result
        task.description = description
        
        box.during = Date.now() - beg

        /**
         * `task.run()` complated 
         */
        box.counter = -1
        this.stack.add(box)
        setTaskCounter(this.tasks, task)
      } catch(e) {
        /**
         * task failed, collect errors, set flag, and ready 
         * do rollback action
         */
        task.result = TaskResult.Fail
        task.description = String(e)
        this.messages.add({ 
          type: TaskManagerMessageType.Error, 
          box, 
          msg: String(e)
        })
      }
    }))
    
    /**
     * if any errors happend, stop run next loop, otherwise
     * stil call `run()` until no tasks found
     */
    if(this.errors.size) return
    return this.run()
  }

  async rollback(): Promise<void> {
    for await (const task of this.stack) {
      try {
        task.result = undefined
        await task.rollback()
      } catch(e) {
        this.messages.add({ 
          type: TaskManagerMessageType.Error, 
          box: task, 
          msg: String(e)
        })
      }
    }
  }

  /**
   * reset varabiles for next state
   */
  private reset(state: TaskManagerState) {
    this.result = undefined
    this.errors.clear()
    this.state = state
    return this
  }

  render(): Array<TaskManagerRendered> {
    const acc: Array<TaskManagerRendered> = []
    this.tasks.forEach(box => {
      acc.push({
        id: box.id.toString(),
        name: box.task.title,
        state: box.task.state,
        result: box.task.result,
        description: box.task.description,
        during: box.during,
        dynamic: !box.task.static,
        depth: parentIssue(box)
      })
    })

    return acc

    function parentIssue(box: TaskBox, depth: number = 0): number {
      if(0 === box.issues.size) return depth
      return Math.max.apply(
        null, 
        Array.from(box.issues).map(ibox => parentIssue(ibox, depth + 1))
      )
    }
  }

  renderMessage(): Array<TaskManagerMessageRendered> {
    const acc: Array<TaskManagerMessageRendered> = []
    this.messages.forEach(({ box, type, msg }) => acc.push({
      id: box.id,
      name: box.task.title,
      type,
      msg
    }))
    return acc
  }

  async start(handler: () => void): Promise<void> {
    this.exit = exit(handler)
    /**
     * initial all tasks
     */
    await this.reset(TaskManagerState.Start).init()

    /**
     * validate tasks
     */
    try {
      await this.reset(TaskManagerState.Validate).validate()
      this.result = TaskManagerResult.Done
    } catch(e) {
      this.result = TaskManagerResult.Fail
      return this.exit(2)
    }

    /**
     * run task recur
     */
    await this.reset(TaskManagerState.Run).run()
    

    /**
     * run tasks successful
     */
    if(!this.errors.size) {
      this.result = TaskManagerResult.Done
      return this.exit(0)
    } else {
      this.result = TaskManagerResult.Fail
      return this.exit(2)
    }

    /**
     * run rollback
     */
    await this.reset(TaskManagerState.Rollback).rollback()

    /**
     * rollback failed
     */
    if(this.errors.size) {
      console.log(Array.from(this.rollbackErrors))
      this.exit()
      return
    }
  }
}

/**
 * exit app
 * 
 * @param f call function before `process.exit`
 */
function exit(f: () => void) {
  return (code?: number): void => {
    setTimeout(() => {
      f()
      process.exit(code)
    }, 500)
  }
}

async function runTaskAction(action: { [K in keyof TaskAction]: TaskAction[K] }[keyof TaskAction]): Promise<[TaskResult, string | undefined]> {
  const result: TaskResultReturnType | void = await action()
  return !result 
    ? [ TaskResult.Done, undefined ]
    : isArray(result)
    ? result
    : isString(result)
    ? [ TaskResult.Done, result ]
    : [ result, undefined ]
}

export function mapToTaskManagerStateProps(state: TaskManagerState, result?: TaskManagerResult): { icon: boolean | string, color: string, state: string } {
  switch(state) {
    case TaskManagerState.Init: return { icon: true, color: 'gray', state: 'initializing...' }
    case TaskManagerState.Start: return { icon: true, color: 'gray', state: 'starting...' }
    case TaskManagerState.Validate: {
      switch(result) {
        case TaskManagerResult.Fail: return { icon: '✗', color: 'redBright', state: 'invalide' }
        case TaskManagerResult.Done: return { icon: '✓', color: 'blueBright', state: 'passed' }
        default: return { icon: true, color: 'blueBright', state: 'validating...' }
      }
    }
    case TaskManagerState.Run: {
      switch(result) {
        case TaskManagerResult.Fail: return { icon: '✗', color: 'redBright', state: 'failed' }
        case TaskManagerResult.Done: return { icon: '✓', color: 'greenBright', state: 'complated' }
        default: return { icon: true, color: 'greenBright', state: 'running...' }
      }
    }
    case TaskManagerState.Rollback: {
      switch(result) {
        case TaskManagerResult.Fail: return { icon: '✗', color: 'redBright', state: 'panic' }
        case TaskManagerResult.Done: return { icon: '✓', color: 'magentaBright', state: 'cancled' }
        default: return { icon: true, color: 'magentaBright', state: 'rollbacking...' }
      }
    }
    default: throw new Error(`Unknown task state "${state}"`)
  }
}

export function mapToTaskStateProps(state: TaskState, result?: TaskResult): { icon: boolean | string, color: string, state: string } {
  switch(state) {
    case TaskState.Init: return { icon: true, color: 'gray', state: 'initializing...' }
    case TaskState.Validate: {
      switch(result) {
        case TaskResult.Fail: return { icon: '✗', color: 'redBright', state: 'failed' }
        case TaskResult.Done: return { icon: '✓', color: 'blueBright', state: 'validated' }
        case TaskResult.Skip: return { icon: '✓', color: 'yellowBright', state: 'skipped' }
        default: return { icon: true, color: 'blueBright', state: 'validating...' }
      }
    }
    case TaskState.Run: {
      switch(result) {
        case TaskResult.Fail: return { icon: '✗', color: 'redBright', state: 'failed' }
        case TaskResult.Done: return { icon: '✓', color: 'greenBright', state: 'complated' }
        case TaskResult.Skip: return { icon: '✓', color: 'yellowBright', state: 'skipped' }
        case TaskResult.Force: return { icon: '✓', color: 'cyanBright', state: 'overrided' }
        default: return { icon: true, color: 'greenBright', state: 'running...' }
      }
    }
    case TaskState.Rollback: {
      switch(result) {
        case TaskResult.Fail: return { icon: '✗', color: 'redBright', state: 'failed' }
        case TaskResult.Done: return { icon: '✓', color: 'magentaBright', state: 'rollbacked' }
        case TaskResult.Skip: return { icon: '✓', color: 'yellowBright', state: 'skipped' }
        case TaskResult.Force: return { icon: '✓', color: 'cyanBright', state: 'overrided' }
        default: return { icon: true, color: 'magentaBright', state: 'rollbacking...' }
      }
    }
    default: throw new Error(`Unknown task state "${state}"`)
  }
}

function createTaskManager(tasklist: Array<any>, options?: any): TaskManager {
  return new TaskManager(tasklist, options)
}

export {
  TaskManagerRendered,
  TaskManagerMessageRendered
}

export default createTaskManager

/**
 * tasks utils
 */

import { isFunction } from "lodash"
import { applyMixins } from "./utils"

/// code

export interface Task<O> {
  readonly title: string
  state: TaskState
  description: string
  context: string
  options: O
  dur?: number
  up(): Promise<void>
  up(): void
  down(): Promise<void>
  down(): void
}

export interface TaskConstructor<O> {
  id: string,
  new(context: string, options: O): Task<O>
}

export type TaskConstructorTuple<T> = { [K in keyof T]: TaskConstructor<T[K]> }

export type TaskTuple<T> = { [K in keyof T]: Task<T[K]> }

export interface TaskGroup<T> extends Task<object> {
  children: TaskTuple<T>
}

export const enum TaskState { Run, Done, Skip, Fail }

export function isComplated(state: TaskState): boolean {
  return state !== TaskState.Run
}

export function isDone(state: TaskState): boolean {
  return state === TaskState.Done || state === TaskState.Skip
}

export function isFail(state: TaskState): boolean {
  return state === TaskState.Fail
}

const counter = {
  value: 0
}

export class StateManager {
  state!: TaskState
  description!: string
  onCompleted?: (isDone: boolean, state: TaskState) => void
  setState(state: TaskState, description?: string) {
    this.state = state
    if(description) this.description = description
    const result: boolean = isDone(state)
    if(result) counter.value += 1
    isFunction(this.onCompleted) && this.onCompleted(result, this.state)
  }
}

export function combineTasks<T extends any[]>(id: string, ...tasks: TaskConstructorTuple<T>) {
  class Tasks implements TaskGroup<T>, StateManager {
    static readonly id: string = id
    readonly title: string = `${id}`
    public state: TaskState = TaskState.Run
    dur!: number
    description!: string
    children!: TaskTuple<T>
    setState!: StateManager['setState']
    counter!: typeof counter
    constructor(public context: string,
                public options: { [key: string]: object } = Object.create(null),
                public onTasksCompleted?: Function) {
      this.context = context
      this.options = options
      this.children = tasks.map(Ctor => {
        const task = new Ctor(context, options[Ctor.id])
        task.onCompleted = this.onTaskCompleted(Ctor.id)
        return task
      }) as TaskTuple<T>
    }

    onTaskCompleted(id: string) {
      return (isDone: boolean, state: TaskState) => {

        const status: Array<TaskState> = this.children.map(t => t.state)
        if(isGroupDone(status)) {
          this.setState(TaskState.Done)
        } else if(isGroupFail(status)) {
          this.setState(TaskState.Fail)
        }

        if(this.state !== TaskState.Run && isFunction(this.onTasksCompleted)) {
          this.onTasksCompleted(this.state)
        }
      }
    }

    async up(): Promise<void> {
      const tasks = () => Promise.all(this.children.map(
        async task => {
          const [res, dur] = await runTaskAndComputeDuring(task.up.bind(task))
          task.dur = dur
          return res
        }
      ))

      const [ress, dur] = await runTaskAndComputeDuring(tasks)
      this.dur = dur
      
    }

    async down(): Promise<void> {}
  }

  return applyMixins(Tasks, StateManager)
}

export function isGroupDone(status: Array<TaskState>): boolean {
  return status.every(isDone)
}

export function isGroupFail(status: Array<TaskState>): boolean {
  return status.some(isFail)
}

export interface RootTask<O> extends TaskGroup<O> {
  counter: typeof counter
}

export function createRootTask<O extends { [k: string]: object }, T extends any[]>(context: string, options: O, ...tasks: TaskConstructorTuple<T>): RootTask<O> {
  const Tasks = combineTasks.apply(null, ['root', ...tasks])
  
  const root = new Tasks(context, options, () => {
    setTimeout(process.exit, 500)
  })
  
  root.counter = counter
  return root
}

export function createTask() {

}

async function runTaskAndComputeDuring<F extends (...a: any[]) => any>(fn: F): Promise<[ReturnType<F>, number, number, number]> {
  const beg: number = Date.now()
  let result: ReturnType<F>
  try {
    result = await fn()
  } catch(e) {
    throw new Error(e)
  }
  const end: number = Date.now()
  return [result, end - beg, beg, end]
}

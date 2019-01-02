/**
 * tasks utils
 */

import { EventEmitter } from "events"
import Task from "./components/Task";
import { isFunction } from "lodash";
import { applyMixins } from "./utils";
import base from "./base";

/// code

export interface Task<O> {
  readonly title: string
  state: TaskState
  description: string
  context: string
  options: O
  beg: number
  end?: number
  up(): void
  down(): void
}

type TaskTuple<T> = { [K in keyof T]: Task<T[K]> }

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

export class StateManager {
  state!: TaskState
  description!: string
  onCompleted?: (isDone: boolean, state: TaskState) => void
  beg!: number
  end!: number
  setState(state: TaskState, description?: string) {
    this.state = state
    if(description) this.description = description
    this.end = Date.now()
    if(isFunction(this.onCompleted)) {
      this.onCompleted(isDone(state), this.state)
    }
  }
}

export default function createTask<T extends any[]>(id: string, ...tasks: T) {
  class Tasks implements TaskGroup<T>, StateManager {
    static readonly id: string = id
    readonly title: string = `Tasks ${id}`
    state: TaskState = TaskState.Run
    beg: number = Date.now()
    end!: number
    description!: string
    children!: TaskTuple<T>
    setState!: StateManager['setState']
    counter: number = 0
    constructor(public context: string,
                public options: object = Object.create(null),
                public onTasksCompleted?: Function) {
      this.context = context
      this.options = options
      this.children = tasks.map(Task => {
        const task = new Task(context, options[Task.id])
        task.onCompleted = this.onTaskCompleted(Task.id)
        return task
      })
    }

    onTaskCompleted(id: string) {
      return (isDone: boolean, state: TaskState) => {
        if(isDone) this.counter += 1
        this.end = Date.now()

        const status: Array<TaskState> = this.children.map(t => t.state)
        if(isGroupDone(status)) {
          this.setState(TaskState.Done)
          this.counter += 1
        } else if(isGroupFail(status)) {
          this.setState(TaskState.Fail)
        }

        if(this.state !== TaskState.Run && isFunction(this.onTasksCompleted)) {
          this.onTasksCompleted(this.state)
        }
      }
    }

    up(): void { this.beg = Date.now() }
    down(): void {}
  }

  return applyMixins(Tasks, StateManager)
}

export function isGroupDone(status: Array<TaskState>): boolean {
  return status.every(isDone)
}

export function isGroupFail(status: Array<TaskState>): boolean {
  return status.some(isFail)
}

export function createRootTask(context: string, options: object, ...tasks: any[]) {
  const Tasks = createTask.apply(null, ['root', ...tasks])
  const task = new Tasks(context, options, () => {
    task.end = Date.now()
    setTimeout(process.exit, 500)
  })
  return task
}

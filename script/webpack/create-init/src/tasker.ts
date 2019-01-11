/**
 * task
 */

/**
 * Task interface, `O` was task options
 */
export interface TaskInterface<O> extends TaskAction {
  /**
   * task id
   */
  id: string
  title: string
  description?: string
  /**
   * task options
   */
  readonly options: O
  /**
   * task dependencies, can set dynamic dependencies at validate hooks
   */
  dependencies: Set<TaskInterface<any>>
  /**
   * means this task as dependency for other task, and set by configure
   * step
   */
  static?: boolean
  state: TaskState
  result?: TaskResult
}

export interface TaskConstructor<O> {
  new(context: TaskContext, options: O): Task<O>
}

export interface TaskAction {
  validate(): void | string | Promise<void | string>
  run(): TaskResultReturnType | Promise<TaskResultReturnType>
  rollback(): TaskResultReturnType | Promise<TaskResultReturnType>
}

export interface TaskContext {
  root: string,
  cmdroot: string
}

export type TaskResultReturnType = void | TaskResult | string | [TaskResult, string]
export const enum TaskState { Init, Validate, Run, Rollback }
export const enum TaskResult { Fail, Done, Skip, Force }

export default abstract class Task<O> implements TaskInterface<O> {
  id!: string
  title!: string
  description!: string
  abstract options: O
  dependencies: Set<TaskInterface<any>> = new Set()
  state: TaskState = TaskState.Init
  result?: TaskResult
  constructor(public readonly context: TaskContext) {}
  validate() {}
  run() {}
  rollback() {}
}

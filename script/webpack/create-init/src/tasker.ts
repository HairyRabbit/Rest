/**
 * task
 */

/**
 * Task interface, `O` was task options
 */
export interface TaskInterface<O> {
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
  state: TaskState
  result?: TaskResult
  validate(addDependency?: <D>(t: TaskInterface<D>) => Promise<void>): Promise<void>
  run(): Promise<void>
  rollback(): Promise<void>
}

export interface TaskConstructor<O> {
  new(context: string, options: O): TaskInterface<O>
}

export const enum TaskState { Init, Validate, Run, Complate, Rollback }
export const enum TaskResult { Done, Skip, Force, Fail }

export default class Task implements TaskInterface<{}> {
  public id!: string
  public title!: string
  public description!: string
  public options: {} = {}
  public dependencies: Set<TaskInterface<any>> = new Set()
  public state: TaskState = TaskState.Init
  public result?: TaskResult
  constructor(public readonly context: string) {}
  public async validate(addDependency?: <D>(t: TaskInterface<D>) => Promise<void>): Promise<void> {
    addDependency
  }
  public async run() {}
  public async rollback() {}
}

/**
 * group tasks
 */

import Task, { TaskResult, TaskContext } from "../tasker"


/// code

export interface Options {
  readonly _?: [ string? ]
  readonly name?: string
}

export default class Group extends Task<Options> {
  private name: NonNullable<Options['name']>
  private flag: string = '<group>'

  constructor(public context: TaskContext, public options: Options) {
    super(context)

    const { _: defaults = [], name: _name } = this.options
    const [ _name_ ] = defaults
    const name = _name || _name_

    if(!name) throw new Error(
      `${this.flag} group name was required`
    )

    this.name = name
    this.id = `group(${this.name})`
    this.title = `+${this.name}`
  }

  run() { return TaskResult.Skip }
}

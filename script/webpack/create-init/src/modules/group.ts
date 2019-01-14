/**
 * group tasks
 */

import Task, { TaskResult, TaskContext, TaskOptions } from "../tasker"


/// code

interface Options extends TaskOptions<[Options['name']]> {
  readonly _?: [ Options['name'] ]
  readonly name?: string
}

class Group extends Task<Options> {
  protected name: NonNullable<Options['name']>
  protected flag: string = '<group>'

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

export { Options }
export default Group

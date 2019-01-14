/**
 * create dir
 */

import path from 'path'
import fs from 'fs'
import Task, { TaskResult, TaskResultReturnType, TaskContext, TaskOptions } from '../tasker'
import { isDirExists, getParentPath, formatToPosixPath } from '../utils'

export interface Options extends TaskOptions<[Options['dirpath']]>{
  readonly _?: [ Options['dirpath'] ]
  readonly dirpath?: string
}

export default class MakeDir extends Task<Options> {
  protected target: NonNullable<Options['dirpath']>
  protected flag: string = '<mkdir>'
  private exists: boolean = false
  private created: boolean = false
  
  /**
   * initial and validate options
   */
  constructor(public context: TaskContext, public options: Options) {
    super(context)

    const { root } = context
    const { _: defaults = [], dirpath: _dirpath } = options

    const dirpath = defaults[0] || _dirpath

    if(!dirpath) throw new Error(`
      ${this.flag} options.dirpath was required`
    )

    /**
     * make sure path was absoulte
     */
    this.target = path.resolve(dirpath)
    const relative: string = path.relative(root, this.target)

    /**
     * the task id should provide and unique
     */
    this.id = `mkdir(${this.target})`
    this.title = `create dir @/${root === this.target ? '' : formatToPosixPath(relative) + '/'}`
  }

  /**
   * validate parent dir exists, if not, create a sub task to make it
   */
  validate() {
    this.exists = isDirExists(this.target)
    if(this.exists) return

    const parent: string = getParentPath(this.target)
    if(isDirExists(parent)) return
    this.dependencies.add(new MakeDir(this.context, { dirpath: parent }))
  }

  run() {
    if(this.exists) return TaskResult.Skip
    
    fs.mkdirSync(this.target, { recursive: true })
    this.created = true
    return
  }

  rollback() {
    if(!this.created) return TaskResult.Skip
    fs.rmdirSync(this.target)
    
    return
  }
}

/**
 * create dir
 */

import path from 'path'
import fs from 'fs'
import Task, { TaskResult, TaskResultReturnType, TaskContext } from '../tasker'
import { isDirExists, isPathRelativeContext, getParentPath, formatToPosixPath } from '../utils'

export interface Options {
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
    const { dirpath } = options
    
    if(!dirpath) {
      throw new Error(`${this.flag} options.dirpath was required`)
    }

    /**
     * make sure path was absoulte
     */
    this.target = path.resolve(dirpath)
    const relative: string = path.relative(root, this.target)

    this.id = `mkdir(${this.target})`
    this.title = `create dir @/${root === this.target ? '' : formatToPosixPath(relative) + '/'}`
  }

  async validate(): Promise<void | string> {
    this.exists = isDirExists(this.target)
    if(this.exists) return

    /**
     * if parent path not exists, create it as a dependency task
     */
    const parent: string = getParentPath(this.target)
    if(isDirExists(parent)) return
    this.dependencies.add(new MakeDir(this.context, { dirpath: parent }))
  }

  async run(): Promise<TaskResultReturnType> {
    if(this.exists) return TaskResult.Skip
    fs.mkdirSync(this.target, { recursive: true })
    this.created = true
  }

  async rollback(): Promise<TaskResultReturnType> {
    if(!this.created) return TaskResult.Skip
    fs.rmdirSync(this.target)
  }
}

/**
 * create dir
 */

import path from 'path'
import fs from 'fs'
import Task, { TaskResult, TaskInterface } from '../tasker'
import { isDirExists, isPathRelativeContext, checkDirExists, rmdirs, getParentPath, formatToPosixPath } from '../utils'

export interface Options {
  readonly dirpath?: string
}

export default class MakeDir extends Task implements TaskInterface<Options> {
  private flag: string = '<mkdir>'
  private target: NonNullable<Options['dirpath']>
  private exists: boolean = false
  private created: boolean = false
  private shouldCreated: Array<string> = []
  
  /**
   * initial and validate options
   */
  constructor(public context: string, public options: Options) {
    super(context)

    const { dirpath } = options
    
    if(!dirpath) {
      throw new Error(`${this.flag} options.dirpath was required`)
    } else if(path.isAbsolute(dirpath) && !isPathRelativeContext(dirpath, this.context)) {
      throw new Error(`${this.flag} options.dirpath should relative from context`)
    }

    /**
     * make sure path was absoulte
     */
    this.target = path.resolve(dirpath)
    const relative: string = path.relative(this.context, this.target)

    this.id = `mkdir(${this.target})`
    this.title = `create dir ~/${this.context === this.target ? '' : formatToPosixPath(relative)}`
  }

  async validate(): Promise<void> {
    throw 42
    this.exists = isDirExists(this.target)
    if(this.exists) return
    const parent: string = getParentPath(this.target)
    if(isDirExists(parent)) return
    this.dependencies.add(new MakeDir(this.context, { dirpath: parent }))
  }

  async run(): Promise<void> {
    if(this.exists) {
      this.result = TaskResult.Skip
      return
    }
    fs.mkdirSync(this.target, { recursive: true })
    this.created = true
  }

  async rollback(): Promise<void> {
    if(!this.created) {
      this.result = TaskResult.Skip
      return
    }
    // rmdirs(this.shouldCreated.reverse())
  }
}

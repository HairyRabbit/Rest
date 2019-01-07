/**
 * create file from content
 */

import fs from 'fs'
import path from 'path'
import Task, { TaskResult, TaskInterface } from '../tasker'
import MakeDir, { Options as MakeDirOptions } from './mkdir'
import { getFileHash, getContentHash, isFileExists, isDirExists, formatToPosixPath } from '../utils'
import { isUndefined } from 'lodash'

/// code

export interface Options {
  readonly filepath?: string
  readonly content?: string | Buffer
  readonly override?: boolean
}

export default class MakeFile extends Task implements TaskInterface<Options> {
  public target: NonNullable<Options['filepath']>
  public content: NonNullable<Options['content']>
  private exists: boolean = false
  private sumchecked: boolean = false
  private created: boolean = false

  constructor(public context: string, public options: Options) {
    super(context)
    const { filepath, content } = this.options
    
    if(isUndefined(filepath)) {
      throw new Error('<mkfile> options.filepath was required')
    }

    this.target = path.resolve(this.context, filepath)
    const relative: string = path.relative(this.context, this.target)
    this.content = content || ''
    this.id = `mkfile(${this.target})`
    this.title = `create file ~/${formatToPosixPath(relative)}`
  }

  async validate(addDependency: <D>(t: Task<D>) => Promise<void>): Promise<void> {
    /**
     * check file and dir paths
     */
    this.exists = isFileExists(this.target)
    if(!this.exists) {
      const dir: string = path.dirname(this.target)
      /**
       * if dir not exists, add sub task to create dir first 
       */
      if(isDirExists(dir)) return
      const task = new MakeDir(this.context, { dirpath: dir })
      this.dependencies.add(task)
      // await addDependency<MakeDirOptions>(new MakeDir(this.context, { dirpath: dir }))
      return
    }

    /**
     * checksum use md5
     */
    const filehash: string | null = getFileHash(this.target)
    const contenthash: string | null = getContentHash(this.content)
    this.sumchecked = filehash === contenthash

    /**
     * throw when checksum failed, and override not allowed
     */
    if(!this.sumchecked) throw new Error(
      `<mkfile> file already exists and invalid ${this.target}`
    )
  }

  async run(): Promise<void> {
    /**
     * skipped task, when the sumchecked 
     */
    if(this.sumchecked) {
      this.result = TaskResult.Skip
      return
    }

    fs.writeFileSync(this.target, this.content, 'utf8')
    this.created = true

  }

  async rollback(): Promise<void> {
    if(!this.created) return
    fs.unlinkSync(this.target)
  }
}

/**
 * create file from content
 */

import fs from 'fs'
import path from 'path'
import Task, { TaskResult, TaskResultReturnType, TaskContext } from '../tasker'
import MakeDir from './mkdir'
import { getFileHash, getContentHash, isFileExists, isDirExists, formatToPosixPath } from '../utils'
import { isUndefined } from 'lodash'

/// code

export interface Options {
  readonly _?: [ string?, string? ]
  readonly filepath?: string
  readonly content?: string | Buffer
  readonly override?: boolean
}

export default class MakeFile extends Task<Options> {
  protected target: NonNullable<Options['filepath']>
  protected content: NonNullable<Options['content']>
  protected override: NonNullable<Options['override']>
  protected flag: string = '<mkfile>'
  private exists: boolean = false
  private sumchecked: boolean = false
  private created: boolean = false

  constructor(public context: TaskContext, public options: Options) {
    super(context)

    const { root } = context
    const { _: defaults = [], 
            filepath: _filepath, 
            content: _content, 
            override = false } = this.options

    const [ _filepath_, _content_ ] = defaults
    const filepath = _filepath || _filepath_
    const content = _content || _content_
    
    if(isUndefined(filepath)) throw new Error(
      `${this.flag} file path was required`
    )

    this.target = path.resolve(root, filepath)
    const relative: string = path.relative(root, this.target)
    this.content = content || ''
    this.id = `mkfile(${this.target})`
    this.title = `create file @/${formatToPosixPath(relative)}`
    this.override = override
  }

  validate() {
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
      this.dependencies.add(new MakeDir(this.context, { dirpath: dir }))
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
    if(false === this.override && false === this.sumchecked) throw new Error(
      `<mkfile> file already exists and invalid ${this.target}`
    )
  }

  run(): TaskResultReturnType {
    /**
     * skipped task, when the sumchecked 
     */
    if(this.sumchecked) return TaskResult.Skip

    fs.writeFileSync(this.target, this.content, 'utf8')
    this.created = true

  }

  rollback(): TaskResultReturnType {
    if(!this.created) return TaskResult.Skip
    fs.unlinkSync(this.target)
  }
}

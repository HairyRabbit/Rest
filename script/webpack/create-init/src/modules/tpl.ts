/**
 * apply template with make file
 */

import fs from 'fs'
import path from 'path'
import { template } from 'lodash'
import { TaskContext } from "src/tasker"
import MakeFile, { Options as MakeFileOptions } from "./mkfile"


/// code

export interface Options extends MakeFileOptions {
  readonly _?: [ string? ]
  readonly filepath?: string
  readonly src?: string
  readonly dir?: string
  readonly ext?: string
}

export default class Template extends MakeFile {
  protected flag: string = '<tpl>'
  constructor(public context: TaskContext, public options: Options) {
    super(context, options)

    const { _: defaults = [],
            src: _src, 
            dir = 'templates',
            ext = 'txt',
            ...rest } = options
    
    const [ filepath, _src_ ] = defaults
    const src: string = _src || _src_ || filepath || path.basename(this.target)
    const srcext: string = src.endsWith(ext) ? src : src + '.' + ext
    const root: string = context.cmdroot
    const tplpath: string = path.resolve(root, dir, srcext)
    
    this.content = template(fs.readFileSync(tplpath, 'utf8'))({ ...rest, ...context })
    this.id = this.id.replace('mkfile', 'tpl')
    this.title = this.title.replace('create file', 'apply template') + ' <~ ' + srcext
  }
}

/**
 * create .gitignore file
 */

import { template } from 'lodash'
import tpl from './template.txt'
import MakeFile, { Options as MakeFileOptions } from '../mkfile'

/// code

export interface Options extends MakeFileOptions {
  readonly addons?: string
}

export default class GitIgnore extends MakeFile {
  constructor(public context: string, public options: Options) {
    super(context, { filepath: '.gitignore', ...options })
    this.id = `gitignore`
    this.content = template(tpl)({ addons: options.addons || '' })
    this.flag = `<${this.id}>`
  }
}

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
  constructor(context: string, options: Options) {
    super(context, { filepath: './.gitignore', ...options })
    this.id = `gitignore`
    this.title = `create ~/.gitignore`
    this.content = template(tpl)({ addons: options.addons || '' })
  }
}

/**
 * create .editorconfig file
 */

import { template } from 'lodash'
import tpl from './template.txt'
import MakeFile, { Options as MakeFileOptions } from '../mkfile'

/// code

export interface Options extends MakeFileOptions {
}

export default class EditorConfig extends MakeFile {
  constructor(public context: string, public options: Options) {
    super(context, { filepath: '.editorconfig', ...options })
    this.id = `editorconfig`
    this.content = template(tpl)({})
    this.flag = `<${this.id}>`
  }
}

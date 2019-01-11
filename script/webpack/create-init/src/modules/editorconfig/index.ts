/**
 * create .editorconfig file
 */

import { template } from 'lodash'
import tpl from './template.txt'
import MakeFile, { Options as MakeFileOptions } from '../mkfile'
import { TaskContext } from '../../tasker'


/// code

export interface EditorConfigOptions extends MakeFileOptions {
}

export default class EditorConfig extends MakeFile {
  constructor(public context: TaskContext, public options: EditorConfigOptions) {
    super(context, { filepath: '.editorconfig', ...options })
    this.id = `editorconfig`
    this.content = template(tpl)({})
    this.flag = `<${this.id}>`
  }
}

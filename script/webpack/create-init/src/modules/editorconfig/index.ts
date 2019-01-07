/**
 * create .editorconfig file
 */

import { template } from 'lodash'
import tpl from './template.txt'
import MakeFile, { Options as MakeFileOptions } from '../mkfile'

/// code

export default class EditorConfig extends MakeFile {
  constructor(context: string) {
    super(context, { filepath: './.editorconfig' })
    this.id = `editorconfig`
    this.title = `create ~/.editorconfig`
    this.content = template(tpl)({})
  }
}

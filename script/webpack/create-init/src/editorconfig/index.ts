/**
 *
 */

import path from 'path'
import fs from 'fs'
import { template } from 'lodash'
import { getFileHash, getContentHash, applyMixins } from '../utils'
import tpl from './template.txt'
import { Task, TaskState, StateManager } from '../task'


export interface Options {
  readonly addons?: Array<string>
}

class Editorconfig implements Task<Options>, StateManager {
  static readonly id: string = 'editorconfig'
  readonly title: string = 'Create file ~/.editorconfig'
  state: TaskState = TaskState.Run
  description!: string
  private targetFile: string = '.editorconfig'
  private targetPath: string
  beg: number = 0
  end!: number
  setState!: StateManager['setState']
  constructor(public context: string, public options: Options = Object.create(null)) {
    this.context = context
    this.options = options
    this.targetPath = path.resolve(this.context, this.targetFile)
  }
  up(): void {
    this.beg = Date.now()
    const { addons } = this.options
    const hash: null | string = getFileHash(this.targetPath)
    const tplstr = template(tpl)()
    // const tplstr = template(tpl)({ addons: addons!.join('\n') })
    if(!hash) {
      fs.writeFileSync(this.targetPath, tplstr)

      this.setState(TaskState.Done)
    } else {
      if(hash === getContentHash(tplstr)) {
        this.setState(TaskState.Skip)
      } else {
        this.setState(TaskState.Fail, `failed, target already exists and invaild`)
      }
    }
  }
  down(): void {
    fs.unlinkSync(this.targetPath)
  }
}

export default applyMixins(Editorconfig, StateManager)

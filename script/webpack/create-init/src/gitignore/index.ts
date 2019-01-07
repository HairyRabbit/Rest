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

class GitIgnore implements Task<Options>, StateManager {
  static readonly id: string = 'gitignore'
  readonly title: string = 'create file ~/.gitignore'
  state: TaskState = TaskState.Run
  description!: string
  private targetFile: string = '.gitignore'
  private targetPath: string
  setState!: StateManager['setState']
  constructor(public context: string, public options: Options = Object.create(null)) {
    this.context = context
    this.options = options
    this.targetPath = path.resolve(this.context, this.targetFile)
  }
  up(): void {
    const { addons } = this.options
    const hash: null | string = getFileHash(this.targetPath)
    const tplstr = template(tpl)({ addons: '' })
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

export default applyMixins(GitIgnore, StateManager)

/**
 * apply template with make file
 */

import { TaskContext } from "src/tasker"
import MakeFile, { Options as MakeFileOptions } from "./mkfile"


/// code

export interface Options extends MakeFileOptions {
  readonly _?: [ string? ]
  readonly filepath?: string
}

export default class Template extends MakeFile {
  constructor(public context: TaskContext, public options: Options) {
    super(context, options)

  }
}

/**
 * thread preset, used chain with other loader
 *
 * @see [thread-loader](https://github.com/webpack-contrib/thread-loader)
 * @todo add prewarming
 */

import { isUndefined } from "lodash"
import Preset from "../preset"
import { DependencyCompose } from "../dep"
import { Builder } from "../builder"


/// code

export interface Options {
  readonly name?: string,
  readonly use?: string
  readonly loader?: ThreadLoaderOptions
}

export default class ThreadPreset extends Preset<Options> {
  public name: string
  public readonly use: []
  public readonly dependencies: Array<DependencyCompose<Options>> = ['thread-loader']
  constructor({ name }: Options = {}) {
    super()
    this.name = name || 'thread'
  }
  apply(builder: Builder, { use, loader = {} }: Options = {}) {
    if(isUndefined(use)) throw new Error(
      `thread-loader options.use was requied`
    )

    if(isUndefined(loader.name)) loader.name = `${this.name}/thread`

    builder
      .setRuleLoaderDev(use, 'thread-loader')
      .setRuleLoaderOptionsDev(use, 'thread-loader', loader)
  }
}

interface ThreadLoaderOptions {
  workers?: number
  workerParallelJobs?: number
  workerNodeArgs?: Array<string>
  poolTimeout?: number
  poolParallelJobs?: number
  name?: string
}

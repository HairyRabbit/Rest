/**
 * cache preset, used chain with other loader
 *
 * @see [cache-loader](https://github.com/webpack-contrib/cache-loader)
 */

import MemoryFS from 'memory-fs'
import { isUndefined } from "lodash"
import Preset from "../preset"
import { DependencyCompose } from "../dep"
import { Builder } from "../builder"


/// code

export interface Options {
  readonly name?: string,
  readonly use?: string
  readonly loader?: CacheLoaderOptions
}

export default class CachePreset extends Preset<Options> {
  public name: string
  public readonly use = []
  public readonly dependencies: Array<DependencyCompose<Options>> = ['cache-loader']
  constructor(options: Options = {}) {
    super(options)
    this.name = options.name || 'cache'
  }
  apply(builder: Builder, { use, loader = {} }: Options = {}) {
    if(isUndefined(use)) throw new Error(
      `cache-loader options.use was requied`
    )

    if(isUndefined(loader.cacheIdentifier)) loader.cacheIdentifier = `${this.name}/cache`

    if(isUndefined(loader.write) && isUndefined(loader.read)) {
      const { write, read } = memoryFSAdapter()
      loader.write = write
      loader.read = read
    }

    builder
      .setRuleLoaderDev(use, 'cache-loader')
      .setRuleLoaderOptionsDev(use, 'cache-loader', loader)
  }
}

interface CacheLoaderOptions {
  cacheContext?: string
  cacheDirectory?: string
  cacheIdentifier?: string
  write?: CacheLoaderWriter
  read?: CacheLoaderReader
  cacheKey?(options: CacheLoaderOptions, request: string): string
}

interface CacheLoaderWriter {
  (cacheKey: string, data: any, callback: CacheLoaderFSCallback): void
}

interface CacheLoaderReader {
  (cacheKey: string, callback: CacheLoaderFSCallback): void
}

interface CacheLoaderFSCallback {
  (error: Error | undefined): void
  (error: Error | null, data?: any): void
}

function memoryFSAdapter(): { write: CacheLoaderWriter, read: CacheLoaderReader } {
  const fs = new MemoryFS()
  return {
    write: fs.writeFile,
    read: fs.readFile
  }
}

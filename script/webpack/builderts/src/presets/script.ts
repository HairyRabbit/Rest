/**
 * script preset
 */

import { cpus } from 'os'
import TerserPlugin from 'terser-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { Builder } from '../builder'
import Preset, { PresetOption } from '../preset'
import { DependencyCompose } from '../dep'

export enum Compiler {
  Babel = 'babel',
  TypeScript = 'typescript'
}

export enum Compresser {
  Uglify = 'uglify-es',
  Terser = 'terser',
  Closure = 'closure-compiler',
  Babel = 'babel-minify'
}

export type Compress = [ Compresser, Object ]

export interface Options {
  readonly compiler?: Compiler
  readonly preCompiler?: boolean
  readonly postCompiler?: boolean
  readonly useCacheLoader?: boolean
  readonly cacheLoaderOptions?: Object
  readonly useThreadLoader?: boolean
  readonly threadLoaderOptions?: Object
  readonly compress?: boolean
  readonly compressOptions?: Object
}

function assertUseTypescript(options: Options) {
  return Compiler.TypeScript === options.compiler
}

const DEFAULT_COMPRESSOPTIONS: Options['compressOptions'] = {
  cache: true,
  parallel: true,
  sourceMap: true
}

export default class ScriptPreset extends Preset<Options> {
  public readonly name: string = 'script'
  public readonly use: PresetOption<Options> = []
  public readonly dependencies: Array<DependencyCompose<any>> = [
    ['ts-loader', { assert: assertUseTypescript }],
    ['fork-ts-checker-webpack-plugin', { assert: assertUseTypescript }],
    'terser-webpack-plugin',
    'babel-loader',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-typescript'
  ]


  apply(builder: Builder, { compiler = Compiler.TypeScript,
                            useCacheLoader = true,
                            cacheLoaderOptions,
                            useThreadLoader = false,
                            threadLoaderOptions,
                            compress = true,
                            compressOptions = DEFAULT_COMPRESSOPTIONS }: Options = {}): void {

    if(useCacheLoader) {
      builder.setRuleLoaderDev(this.name, 'cache-loader', {
        options: {
          cacheIdentifier: this.name
        }
      })
    }

    if(useThreadLoader) {
      builder.setRuleLoaderDev(this.name, 'thread-loader', {
        options: {
          workers: cpus().length - 1
        }
      })
    }



    if(compress) {
      builder.setPluginProd(this.name + 'compress', TerserPlugin, compressOptions)
    }

    builder
      .setRuleFileTypes(this.name, ['ts', 'tsx'])
      .setRuleLoaderDev(this.name, 'cache-loader', {
        options: {
          cacheIdentifier: 'ts'
        }
      })
      .setRuleLoaderDev(this.name, 'thread-loader', {
        options: {
          workers: cpus().length - 1
        }
      })
      .setRuleLoader(this.name, 'ts-loader')
      .setRuleLoaderOptionsDev(this.name, 'ts-loader', {
        happyPackMode: true,
        transpileOnly: true,
        experimentalWatchApi: true
      })
      .setRuleLoaderOptionsProd(this.name, 'ts-loader', {
        transpileOnly: false
      })
      .setPluginDev(this.name + 'checker', ForkTsCheckerWebpackPlugin, {
        options: {
          checkSyntacticErrors: true,
          context: builder.context
        }
      })
      .setPluginProd(this.name + 'min', TerserPlugin, compressOptions)
  }
}
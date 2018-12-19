/**
 * script preset
 *
 * @todo add thread-loader prewarming
 */

import { cpus } from 'os'
import { isFunction, isArray } from 'lodash'
import { Builder } from '../../builder'
import Preset, { PresetOption } from '../../preset'
import { DependencyCompose } from '../../dep'
import compressors, { Compressor } from './compressor'
import { Compiler } from './compiler'


export interface Options {
  readonly compiler?: Compiler
  readonly compressor?: Compressor | [ Compressor, object | ((o?: object) => object | undefined) ]
  readonly preCompiler?: boolean
  readonly postCompiler?: boolean
  readonly useCacheLoader?: boolean
  readonly cacheLoaderOptions?: Object
  readonly useThreadLoader?: boolean
  readonly threadLoaderOptions?: Object
}

function assertUseTypescript(options: Options) {
  return Compiler.TypeScript === options.compiler
}

function assertCompressor(assertCompressor: Compressor) {
  return ({ compressor }: Options): boolean => {
    return assertCompressor === compressor
  }
}

export default class ScriptPreset extends Preset<Options> {
  public readonly name: string = 'script'
  public readonly use: PresetOption<Options> = []
  public readonly dependencies: Array<DependencyCompose<any>> = [
    ['ts-loader', { assert: assertUseTypescript }],
    ['fork-ts-checker-webpack-plugin', { assert: assertUseTypescript }],
    ['typescript', { assert: assertUseTypescript }],
    'babel-loader',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-typescript',

    /**
     * compressor
     */
    ['uglifyjs-webpack-plugin', { assert: assertCompressor(Compressor.Uglify) }],
    ['terser-webpack-plugin', { assert: assertCompressor(Compressor.Terser) }],
    ['babel-minify-webpack-plugin', { assert: assertCompressor(Compressor.Babel) }],
    ['closure-webpack-plugin', { assert: assertCompressor(Compressor.Closure) }]
  ]

  apply(builder: Builder, { compiler = Compiler.TypeScript,
                            compressor = Compressor.Uglify,
                            useCacheLoader = true,
                            cacheLoaderOptions,
                            useThreadLoader = false,
                            threadLoaderOptions }: Options = {}): void {

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

    /**
     * setup compiler
     */
    switch(compiler) {
      case Compiler.TypeScript: {
        builder
          .setRuleFileTypes(this.name, ['js', 'jsx', 'ts', 'tsx'])
          .setRuleLoaderOptionsDev(this.name, 'ts-loader', {
            happyPackMode: true,
            transpileOnly: true,
            experimentalWatchApi: true
          })
          .setRuleLoaderOptionsProd(this.name, 'ts-loader', {
            transpileOnly: false
          })
          .setPluginDev(this.name + 'checker', 'fork-ts-checker-webpack-plugin', {
            options: {
              checkSyntacticErrors: true,
              context: builder.context
            }
          })

        break
      }

      case Compiler.Babel: {

        break
      }

      default: throw new Error(`Unsupports compiler "${compiler}"`)
    }

    /**
     * setup compressor, only apply at "production" mode
     */
    if(compressor) {
      const  [_compressor, _compressorOptions ] = isArray(compressor)
        ? [ compressor[0], compressor[1] || compressors[compressor[0]].options]
        : [ compressor, compressors[compressor].options ]

      const overrideCompressorOptions = isFunction(_compressorOptions)
        ? _compressorOptions(compressors[_compressor].options)
        : _compressorOptions

      builder.setPluginProd(this.name + 'compressor',
                            compressors[_compressor].module,
                            overrideCompressorOptions)
    }
  }
}

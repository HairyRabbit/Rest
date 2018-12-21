/**
 * script preset
 *
 * @todo js/flow supports
 */

import { isFunction, isArray, isUndefined } from 'lodash'
import { Builder } from '../../builder'
import Preset, { PresetOption, IPresetConstructor } from '../../preset'
import { DependencyCompose } from '../../dep'
import compressors, { Compressor } from './compressor'
import { Compiler } from './compiler'
import { Mode } from '../../mode'
import CachePreset, { Options as CachePresetOptions } from '../cache'
import ThreadPreset, { Options as ThreadPresetOptions } from '../thread'


/// code

export interface Options {
  readonly compiler?: Compiler
  readonly compressor?: Compressor | [ Compressor, object | ((o?: object) => object | undefined) ]
  readonly jsx?: boolean
  readonly flow?: boolean
  readonly preCompiler?: boolean
  readonly postCompiler?: boolean
  readonly cache?: boolean
  readonly thread?: boolean
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
  public readonly dependencies: Array<DependencyCompose<Options>> = [
    ['ts-loader', { assert: assertUseTypescript }],
    ['fork-ts-checker-webpack-plugin', { assert: assertUseTypescript }],
    ['typescript', { assert: assertUseTypescript }],
    'babel-loader',
    '@babel/core',
    '@babel/preset-env',
    ['@babel/preset-typescript', { assert: assertUseTypescript }],
    ['@babel/preset-flow', { assert: options => !!(options && options.flow) }],
    ['@babel/preset-react', { assert: options => !!(options && options.jsx) }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    '@babel/polyfill',
    '@babel/runtime-corejs2',
    /**
     * compressor
     */
    ['uglifyjs-webpack-plugin', { assert: assertCompressor(Compressor.Uglify) }],
    ['terser-webpack-plugin', { assert: assertCompressor(Compressor.Terser) }],
    ['babel-minify-webpack-plugin', { assert: assertCompressor(Compressor.Babel) }],
    ['closure-webpack-plugin', { assert: assertCompressor(Compressor.Closure) }]
  ]

  public apply(builder: Builder, { compiler = Compiler.TypeScript,
                                   compressor = Compressor.Uglify,
                                   jsx = true,
                                   flow = false,
                                   cache = true,
                                   thread = false, }: Options = {}): void {

    const mode = builder.mode

    /**
     * prepend cache-loader
     */
    if(cache) builder.use(
      <IPresetConstructor<CachePresetOptions>>CachePreset,
      { name: `${this.name}:cache`, use: this.name }
    )

    /**
     * prepend thread-loader
     */
    if(thread) builder.use(
      <IPresetConstructor<ThreadPresetOptions>>ThreadPreset,
      { name: `${this.name}:thread`, use: this.name }
    )

    /**
     * setup compiler
     */
    switch(compiler) {
      case Compiler.TypeScript: {
        builder
          .setRuleFileTypes(this.name, jsx ? ['js', 'ts'] : ['js', 'jsx', 'ts', 'tsx'])
          .setRuleLoaderProd(this.name, 'babel-loader')
          .setRuleLoader(this.name, 'ts-loader')
          .setRuleLoaderOptionsDev(this.name, 'ts-loader', {
            happyPackMode: true,
            transpileOnly: true,
            experimentalWatchApi: true,
            experimentalFileCaching: true
          })
          .setRuleLoaderOptionsProd(this.name, 'ts-loader', {
            transpileOnly: false,
            compilerOptions: {
              target: 'ESNext'
            }
          })
          .setPluginDev(this.name + 'checker', 'fork-ts-checker-webpack-plugin', {
            options: {
              checkSyntacticErrors: true,
              context: builder.context
            }
          })
          .setRuleLoaderOptionsProd(this.name, 'babel-loader', {
            cacheIdentifier: `${this.name}/babel`,
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', {
                modules: false,
                loose: true,
                debug: process.env.DEBUG,
                useBuiltIns: 'usage'
              }],
              compiler === Compiler.TypeScript ? ['@babel/preset-typescript'] : null,
              jsx ? ['@babel/preset-react', {
                development: mode === Mode.Dev
              }] : null
            ].filter(Boolean),
            plugins: [
              ['@babel/plugin-proposal-class-properties', {
                loose: true
              }],
              ['@babel/plugin-proposal-object-rest-spread', {
                loose: true,
                useBuiltIns: true
              }],
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-transform-runtime', {
                'corejs': 2
              }]
            ].filter(Boolean)
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
      const [ _compressor, _compressorOptions ] = isArray(compressor)
        ? [ compressor[0], compressor[1] || compressors[compressor[0]].options]
        : [ compressor, compressors[compressor].options ]

      const overrideCompressorOptions = isFunction(_compressorOptions)
        ? _compressorOptions(compressors[_compressor].options)
        : _compressorOptions

      builder.setPluginProd(`${this.name}/compressor`,
                            compressors[_compressor].module,
                            overrideCompressorOptions)
    }
  }
}

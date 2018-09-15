/**
 * webpack option builder
 *
 * a builder helper to build webpack options for easy way
 *
 * @link [webpack option schemas](https://github.com/webpack/webpack/blob/master/schemas/WebpackOptions.json)
 * @flow
 */

import { set, isFunction, isPlainObject, camelCase, defaults } from 'lodash'
import { objectType } from '../../util'
import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackTemplate from 'html-webpack-template'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin  from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import exportPath from './module-umd-path'
import history from 'connect-history-api-fallback'
import proxy from 'http-proxy-middleware'
import convert from 'koa-connect'
import pkg from '../../package.json'


/// code

type WebpackOptions = {
  mode?:
    | 'development'
    | 'production'
    | 'none',
  target?:
    | 'async-node'
    | 'atom'
    | 'electron'
    | 'electron-main'
    | 'electron-renderer'
    | 'node'
    | 'node-webkit'
    | 'web'
    | 'webworker'
    | any => void,
  context?: string,
  entry?:
    | string
    | Array<string>
    | { [name: string]: string | Array<string> }
    | any => (string | Array<string> | { [name: string]: string | Array<string> })
    | any => Promise<(string | Array<string> | { [name: string]: string | Array<string> })>,
  output?: {
    path?: string,
    filename?:
      | string
      | () => string,
    publicPath?:
      | string
      | () => string,
    library?:
      | string
      | {
        root?: string,
        commonjs?: string,
        commonjs2?: string,
        amd?: string
      },
    libraryTarget?:
      | 'umd'
      | 'umd2'
      | 'commonjs2'
      | 'commonjs'
      | 'amd'
      | 'this'
      | 'var'
      | 'assign'
      | 'window'
      | 'global'
      | 'jsonp',
    libraryExport?:
      | string
      | Array<string>,
    pathinfo?: boolean,
    chunkFilename?: string,
    chunkLoadTimeout?: number,
    chunkCallbackName?: string,
    jsonpFunction?: string => string,
    jsonpScriptType?:
      | 'text/javascript'
      | 'module',
    sourceMapFilename?: string,
    devtoolModuleFilenameTemplate?:
      | string
      | ({
        absoluteResourcePath: string,
        allLoaders: string,
        hash: string,
        id: string,
        loaders: string,
        resource: string,
        resourcePath: string,
        namespace: string
      }) => string,
    devtoolFallbackModuleFilenameTemplate?:
      | string
      | ({
        absoluteResourcePath: string,
        allLoaders: string,
        hash: string,
        id: string,
        loaders: string,
        resource: string,
        resourcePath: string,
        namespace: string
      }) => string,
    devtoolNamespace?: string,
    crossOriginLoading?:
      | 'use-credentials'
      | 'anonymous'
      | false,
    devtoolLineToLine?: {
      test: RegExp
    },
    hotUpdateMainFilename?:
      | string
      | () => string,
    hotUpdateChunkFilename?:
      | string
      | () => string,
    hotUpdateFunction?: string => string,
    auxiliaryComment?:
      | string
      | {
        root?: string,
        commonjs?: string,
        commonjs2?: string,
        amd?: string
      },
    hashDigest?: string,
    hashDigestLength?: number,
    hashFunction?:
      | string
      | (string) => string,
    hashSalt?: string,
    sourceMapFilename?: string,
    sourcePrefix?: string,
    strictModuleExceptionHandling?: boolean,
    umdNamedDefine?: boolean,
  },
  externals?:
    | string
    | Array<string>
    | RegExp
    | { [name: string]: string }
    | { [name: string]: {
      root: string,
      commonjs2: string,
      commonjs: string,
      amd: string
    } }
    | (request: any) => string,
  devtool?:
    | boolean
    | 'eval'
    | 'cheap-eval-source-map'
    | 'cheap-module-eval-source-map'
    | 'eval-source-map'
    | 'cheap-source-map'
    | 'cheap-module-source-map'
    | 'inline-cheap-source-map'
    | 'inline-cheap-module-source-map'
    | 'source-map'
    | 'inline-source-map'
    | 'hidden-source-map'
    | 'nosources-source-map',
  node?: {
    console?: boolean | 'mock',
    global?: boolean | 'mock',
    process?: boolean,
    __filename?: boolean | 'mock',
    __dirname?: boolean | 'mock',
    Buffer?: boolean | 'mock',
    setImmediate?: boolean | 'mock' | 'empty'
  },
  plugins?: Array<any>,
  parallelism?: number,
  profile?: boolean,
  bail?: boolean,
  cache?: boolean,
  watch?: boolean,
  watchOptions?: {
    aggregateTimeout?: number,
    poll?: boolean | number
  },
  recordsPath?: string,
  recordsInputPath?: string,
  recordsOutputPath?: string,
  performance?: {
    hints?:
      | 'warning'
      | 'error'
      | boolean,
    maxAssetSize?: number,
    maxEntrypointSize?: number,
    assetFilter?: string => boolean
  },
  stats?:
    | 'errors-only'
    | {
      assets?: boolean,
      colors?: boolean,
      errors?: boolean,
      errorDetails?: boolean,
      hash?: boolean
    },
  module?: {
    rules?: Array<>,
    unknownContextRequest?: string,
    unknownContextRecursive?: boolean,
    unknownContextRegExp?: RegExp,
    unknownContextCritical?: boolean,
    exprContextRequest?: 'string',
    exprContextRegExp?: RegExp,
    exprContextRecursive?: boolean,
    exprContextCritical?: boolean,
    wrappedContextRegExp?: RegExp,
    wrappedContextRecursive?: boolean,
    wrappedContextCritical?: boolean
  },
  resolve?: {
    modules?: Array<string>,
    extensions?: Array<string>,
    descriptionFiles?: Array<string>,
    mainFields?: Array<string>,
    aliasFields?: Array<string>,
    enforceExtension?: boolean,
    moduleExtensions?: Array<string>,
    enforceModuleExtension?: boolean,
    unsafeCache?: boolean | {},
    cachePredicate?: (path: string, request: any) => boolean,
    plugins?: Array<any>,
    alias?: {
      [name: string]: string
    } | Array<{
      name: string,
      alias: string,
      onluModule: boolean
    }>
  },
  optimization?: {
    minimize?: boolean,
    minimizer?: Array<any>,
    splitChunks?: {

    },
    runtimeChunk?:
      | string
      | boolean
      | {
        chunks?: 'async',
        minSize?: number,
        maxSize?: number,
        minChunks?: number,
        maxAsyncRequests?: number,
        maxInitialRequests?: number,
        automaticNameDelimiter?: string,
        name?: boolean,
        cacheGroups?: {
          [name: string]: {
            test?: RegExp,
            priority?: number,
            minChunks: number,
            reuseExistingChunk?: boolean
          }
        }
      },
    noEmitOnErrors?: boolean,
    namedModules?: boolean,
    namedChunks?: boolean,
    nodeEnv?: string | boolean,
    mangleWasmImports?: boolean,
    removeAvailableModules?: boolean,
    removeEmptyChunks?: boolean,
    mergeDuplicateChunks?: boolean,
    flagIncludedChunks?: boolean,
    occurrenceOrder?: boolean,
    providedExports?: boolean,
    usedExports?: boolean,
    concatenateModules?: boolean,
    sideEffects?: boolean,

  },
  devServer?: {},
  serve?: {}
}


type Loader = {
  loader: string,
  options: Map<string, any>
}

type RuleProperty = {
  files: string | Array<string>,
  loaders: Set<Map<string, Loader>>,
  options: Map<string, any>
}

type Rule = Map<string, RuleProperty>

type File = Map<string, string>

type EntryProperty = {
  entry: ?(string | (prepends?: Array<string>) => string),
  prepends: Set<string>
}

type Entry = Map<string, EntryProperty>

type Plugins = {
  [name: string]: {
    constructor: *,
    options: Object
  }
}

type LibProperty = {
  version: string
}

type Lib = Map<string, LibProperty>

type Hint =
  | boolean
  | 'warning'
  | 'warn'
  | 'error'
  | 'err'
  | 'none'

type Options = {
  disableDefaultOptions?: boolean,
  assertFunctionTypeEntry?: Hint,
  assertEntryNotRegister?: Hint
}

class Builder {
  context: ?string
  contextSetted: boolean
  entry: Entry
  entrySetted: boolean
  entryCommons: Set<string>
  output: string
  outputSetted: boolean
  loader: Rule
  files: File
  plugin: Plugins
  isDev: boolean
  alias: Map<string, string>
  libs: Lib
  deps: { [name: string]: string }
  options: WebpackOptions
  opts: Options

  constructor(webpackOptions?: WebpackOptions = {}, options?: Options = {}) {
    this.context = undefined
    this.contextSetted = false
    this.entry = new Map()
    this.entrySetted = false
    this.entryCommons = new Set()
    this.output = undefined
    this.outputSetted = false
    this.loader = new Map()
    this.files = new Map()
    this.plugin = {}
    this.options = {}
    this.opts = defaults(options, {
      disableDefaultOptions: false,
      assertFunctionTypeEntry: true,
      assertEntryNotRegister: false
    })
    this.libs = new Map()

    this
      ._parseWebpackOptions(webpackOptions)
      ._setDefaultOptions(webpackOptions)
      ._guessContext()
      .setLoader('script', 'js', ['babel-loader?cacheDirectory'])
      .setLoader('styleModule', 'css', [
        this.isDev ? 'style-loader?sourceMap' : {
          name: MiniCssExtractPlugin.loader,
          options: {
            sourceMap: true
          }
        },
        {
          name: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
            sourceMap: true,
            localIdentName: '[local]-[hash:base64:5]'
          }
        },
        // {
        //   name: 'postcss-loader',
        //   options: {
        //     sourceMap: true,
        //     plugins: () => [
        //       postcssPresetEnv()
        //     ],
        //     options: {}
        //   }
        // }
      ], {
        exclude: [/node_modules/]
      })
      .setLoader('styleInclude', 'css', [
        this.isDev ? 'style-loader?sourceMap' : {
          name: MiniCssExtractPlugin.loader,
          options: {
            sourceMap: true
          }
        },{
          name: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: true
          }
        },
        // {
        //   name: 'postcss-loader',
        //   options: {
        //     sourceMap: true,
        //     plugins: () => [
        //       postcssPresetEnv()
        //     ],
        //     options: {}
        //   }
        // }
      ], {
        include: [/node_modules/]
      })
      .setPlugin('html', HtmlWebpackPlugin, {
        title: pkg.description,
        template: HtmlWebpackTemplate,
        inject: false,
        mobile: true
      })
      .setPlugin('prefetch', webpack.AutomaticPrefetchPlugin)
      // .setPlugin('style', MiniCssExtractPlugin, {
      //   filename: this.isDev ? '[name].css' : '[name].[contenthash].css'
      // })
  }

  /**
   * parse webpack options
   *
   * @private
   */
  _parseWebpackOptions({ context,
                         output: { path: output } = {},
                         entry,
                         module: { rules } = {},
                         plugins,
                         externals }: WebpackOptions = {}) {
    return this
      ._parseWebpackEntryOption(entry)
      ._parseWebpackOutputOption(output)
      ._parseWebpackContextOption(context)
      ._parseWebpackExternalsOption(externals)
      ._parsePkgDependencies()
  }

  /**
   * parse webpackOption.entry
   *
   * @private
   */
  _parseWebpackEntryOption(entry: $PropertyType<WebpackOptions, 'entry'>,
                           name?: string = 'main') {
    if(!entry) return this

    switch(typeof entry) {
      case 'string': {
        this.setEntry(name, {
          entry
        })

        break
      }

      case 'object': {

        if(Array.isArray(entry)) {

          if(1 === entry.length) {

            this._parseWebpackEntryOption(entry[0], name)

          } else {

            if(!entry.every(pre => 'string' === typeof pre)) {
              throw new Error(
                `Array element type should be string`
              )
            }

            this.setEntry(name, {
              prepends: entry.slice(0, -1),
              entry: entry.slice(-1)[0]
            })
          }

          break

        } else if(isPlainObject(entry)) {

          for(let key in entry) {
            this._parseWebpackEntryOption(entry[key], key)
          }

          break

        } else {
          throw new Error(
            `Unknow webpack entry option type "${objectType(entry)}"`
          )
        }
      }

      case 'function': {
        /**
         * ooops, a dyamic entry, terrible for set prepends,
         * you should set it by yourself, now show a warning here.
         */
        hint(this.opts.assertFunctionTypeEntry)(
          `The dyamic entry ${name} should add prepends by yourself, e.g.

{
  entry: function ${entry.name || 'DyamicEntry'}(prepends) {
    return [...prepends, "your entry"]
  }
}
`
        )

        this.setEntry(name, {
          entry
        })

        break
      }

      default: {
        throw new Error(
          `Unknow webpack entry option type "${typeof entry}"`
        )
      }
    }

    this.entrySetted = true
    return this
  }

  /**
   * parse webpackOption.output.path
   *
   * @private
   */
  _parseWebpackOutputOption(output: $PropertyType<$PropertyType<WebpackOptions, 'output'>, 'path'>) {
    if(!output) return this

    this.setOutput(output)
    this.outputSetted = true

    return this
  }

  /**
   * parse webpackOptions.context
   *
   * @private
   */
  _parseWebpackContextOption(context: $PropertyType<WebpackOptions, 'context'>) {
    if(!context) return this

    this.setContext(context)
    this.contextSetted = true

    return this
  }

  /**
   * parse webpackOption.externals
   *
   * @private
   */
  _parseWebpackExternalsOption(externals) {
    if(!externals) return this

    return this
  }

  /**
   * parse pkg.dependencies
   *
   * @private
   */
  _parsePkgDependencies() {
    const { dependencies, peerDependencies, devDependencies } = pkg
    const deps = {
      ...dependencies,
      ...peerDependencies
    }

    for(let name in deps) {
      const version = deps[name]
      if(this.libs.has(name)) continue

      this.setLib(name, { version })
    }

    this.deps = {
      ...devDependencies,
      ...deps
    }

    return this
  }

  _setDefaultOptions(webpackOption: WebpackOptions) {
    const env = process.env && process.env.NODE_ENV || 'development'

    if('test' !== env) {
      if(!~['development', 'production', 'none'].indexOf(env)) {
        throw new Error(
          `The env should be "development", "production" or "none"`
        )
      }
    }

    const isProd = 'production' === env
    this.isDev = !isProd

    if(this.opts.disableDefaultOptions) return this

    const postcssOptions = {
      plugins: () => [
        postcssPresetEnv()
      ],
      options: {}
    }

    /**
     * commons default options
     */
    this.options = {
      mode: env,
      output: {
        filename: !isProd ? '[name].js' : '[name].[chunkhash].js',
        devtoolModuleFilenameTemplate: sourcemapAbsolutePath,
        publicPath: '/'
      },
      resolve: {
        unsafeCache: true,
        // extensions: ['.js']
      },
      devtool: !isProd ? 'inline-source-map' : 'hidden-source-map'
    }

    /**
     * dev only
     */
    if(!isProd) {
      this.options = {
        ...this.options,

        parallelism: 4,
        cache: true,

        /**
         * server option
         */
        serve: {
          host: '0.0.0.0',
          port: 8080,
          hotClient: {
            host: {
              server: '0.0.0.0',
              client: '127.0.0.1'
            },
            port: 8081
          },
          content: [],
          add(app, middleware, options) {
            app.use(convert(history({
              rewrites: [{
                from: /(.*)/,
                to(context) {
                  const pathname = context.parsedUrl.pathname
                  const ext = path.extname(pathname)

                  if(ext) {
                    return '/' + path.basename(pathname)
                  }

                  return '/'
                }
              }],
              disableDotRule: true
            })))
          }
        }
      }
    }

    /**
     * prod only
     */
    if(isProd) {
      this.options = {
        ...this.options,

        /**
         * optimization options
         */
        optimization: {
          minimizer: [
            new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({
              sourceMap: true,
              cssProcessorOptions: {
                map: {
                  inline: false,
                  annotation: false
                }
              }
            })
          ]
        }
      }
    }

    return this
  }

  /**
   * guess source context if not set
   *
   * @private
   */
  _guessContext() {
    if(this.contextSetted) return this

    const context = ['src', 'lib', '.']
          .map(dir => path.resolve(dir))
          .find(dir => fs.existsSync(dir))

    if(!context) {
      throw new Error(
        `The context dir path not exists, you should set \
context option by build.setContext()`
      )
    }

    return this.setContext(context)
  }

  /**
   * set options.context
   *
   * @public
   */
  setContext(context: string) {
    this.context = context

    if(!this.entrySetted) {
      this._guessEntry()
    }

    if(!this.outputSetted) {
      this.setOutput(
        this.isDev
          ? convertToAbsolutePath('.', this.context)
          : convertToAbsolutePath('build', this.context)
      )
    }

    return this
  }

  /**
   * transform context to options
   *
   * @private
   */
  _transformContext() {
    return this.set('context', this.context, true)
  }

  /**
   * guess possible entry
   *
   * @private
   */
  _guessEntry() {
    if(this.entrySetted) return this

    const entry = ['boot.js', 'index.js']
          .map(file => convertToAbsolutePath(file, this.context))
          .find(file => fs.existsSync(file))

    if(entry) {
      this.setEntry('main', { entry })
    }

    return this
  }

  /**
   * set entry
   *
   * @public
   */
  setEntry(name: string, { entry, prepends = [] }: EntryProperty = {}, internal?: boolean = false) {
    if(this.entry.has(name)) {
      console.warn(
        `The entry "${name}" already exists, \
This operator will override the entry.${name}.

If you want to change entry path, should call:

  builder.setEntryEntry()

or you want to change entry prepends, should call:

  builder.setEntryPrepends()

`
      )
    }

    if(!entry && !internal) {
      console.warn(
        `The entry "${name}" can't set property "entry"`
      )
    }

    if(prepends && !Array.isArray(prepends)) {
      throw new Error(
        `The entry prepends should be array`
      )
    }

    this.entry.set(name, {
      entry,
      prepends: new Set(prepends)
    })

    return this
  }

  /**
   * remove all entry
   *
   * @public
   */
  clearEntry() {
    this.entry.clear()

    return this
  }

  /**
   * delete entry by name
   *
   * @public
   */
  deleteEntry(name: string) {
    this.entry.delete(name)

    return this
  }

  /**
   * set entry entry by name
   *
   * @public
   */
  setEntryEntry(name: string, entry: $PropertyType<EntryProperty, 'entry'>) {
    if(!entry) {
      throw new Error(
        `The entry should provide`
      )
    }

    /**
     * if not have entry, generate a new one
     */
    if(!this.entry.has(name)) {
      this.setEntry(name, { entry })
      return this
    }


    this.entry.get(name).entry = entry
    return this
  }

  /**
   * set entry prepends by name
   *
   * @public
   */
  setEntryPrepends(name: string, prepends: Array<string> = []) {
    if(!prepends || !Array.isArray(prepends)) {
      throw new Error(
        `The entry prepends should be array`
      )
    }

    if(!prepends.every(pre => 'string' === typeof pre)) {
      throw new Error(
        `The entry prepends element type should be string`
      )
    }

    if(!this.entry.has(name)) {
      this.setEntry(name, { prepends }, true)
      return this
    }

    this.entry.get(name).prepends = new Set(prepends)
    return this
  }

  /**
   * clear entry prepends by name
   *
   * @public
   */
  clearEntryPrepends(name: string) {
    if(!this.entry.has(name)) {
      this.setEntry(name, {}, true)
    }

    this.entry.get(name).prepends.clear()
    return this
  }

  /**
   * add entry prepend by name
   *
   * @public
   */
  addEntryPrepend(name: string, prepend: string) {
    if(!this.entry.has(name)) {
      this.setEntry(name, {}, true)
    }

    this.entry.get(name).prepends.add(prepend)
    return this
  }

  /**
   * delete entry prepend by name
   *
   * @public
   */
  deleteEntryPrepend(name: string, prepend: string) {
    if(!this.entry.has(name)) {
      this.setEntry(name, {}, true)
    }

    this.entry.get(name).prepends.delete(prepend)
    return this
  }

  /**
   * set entry commons prepends
   *
   * @public
   */
  setEntryCommonPrepends(prepends: Array<string> = []) {
    if(!prepends || !Array.isArray(prepends)) {
      throw new Error(
        `The entry prepends should be array`
      )
    }

    this.entryCommons = new Set(prepends)
    return this
  }

  /**
   * clear all entry commons prepends
   *
   * @public
   */
  clearEntryCommonPrepends() {
    this.entryCommons.clear()

    return this
  }

  /**
   * add entry commons prepend
   *
   * @public
   */
  addEntryCommonPrepend(prepend: string) {
    this.entryCommons.add(prepend)

    return this
  }

  /**
   * delete entry commons prepend
   *
   * @public
   */
  deleteEntryCommonPrepend(prepend: string) {
    this.entryCommons.delete(prepend)

    return this
  }

  /**
   * transform entry to option
   *
   * @private
   */
  _transformEntry() {
    if(!this.entry.size) {
      throw new Error(
        `Should have more then one entry`
      )
    }

    this.entry.forEach(({ entry, prepends }, name) => {
      if(!entry) return

      const pres = [
        ...Array.from(this.entryCommons),
        ...Array.from(prepends)
      ].filter(Boolean)

      if(isFunction(entry)) {
        this.set(`entry.${name}`, () => entry(pres), true)
      } else {
        this.set(`entry.${name}`, pres.length ? [...pres, entry] : entry, true)
      }
    })

    return this
  }

  /**
   * set output
   *
   * @public
   */
  setOutput(output: string) {
    this.output = convertToAbsolutePath(output)
    return this
  }

  /**
   * transform output to options
   *
   * @private
   */
  _transformOutput() {
    return this.set('output.path', this.output, true)
  }

  /**
   * set loader
   *
   * @public
   */
  setLoader(name: string, { files, loaders, options }: RuleProperty = {}) {
    if(!name) {
      throw new Error(
        `Loader name was required`
      )
    }

    if(this.loader.has(name)) {
      console.warn(
        `The loader "${name}", was exists`
      )
    }

    const opts = new Map()

    for(let key in options) {
      const item = options[key]
      opts.set(key, item)
    }

    this.loader.set(name, null)

    files && this.setLoaderFiles(name, files)
    loaders && this.setLoaderLoaders(name, loaders)
    options && this.setLoaderOptions(name, options)

    return this
  }

  /**
   * clear all the loader
   *
   * @public
   */
  clearLoader() {
    this.loader.clear()
    return this
  }

  /**
   * delete loader by name
   *
   * @public
   */
  deleteLoader(name: string) {
    this.loader.delete(name)
    return this
  }

  /**
   * set loader files
   *
   * @public
   */
  setLoaderFiles(name: string, files: string | Array<string>) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).files) {
      this.loader.get(name).files = new Set()
    }

    [...files].forEach(file => this.addLoaderFile(name, file))
    return this
  }

  /**
   * clear loader files
   *
   * @public
   */
  clearLoaderFiles(name: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).files) {
      this.loader.get(name).files = new Set()
    }

    this.loader.get(name).files.clear()
    return this
  }

  /**
   * add loader file
   *
   * @public
   */
  addLoaderFile(name: string, file: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).files) {
      this.loader.get(name).files = new Set()
    }

    /**
     * hint for used file
     */
    if(this.files.has(file)) {
      console.warn(
        `The loader "${this.files.get(file)}" already defined the file loader "${file}"`
      )
    }

    this.files.set(file, name)
    this.loader.get(name).files.add(file)
    return this
  }

  /**
   * delete loader file
   *
   * @public
   */
  deleteLoaderFile(name: string, file: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).files) {
      this.loader.get(name).files = new Set()
    }

    this.loader.get(name).files.delete(file)
    return this
  }

  /**
   * set loader options
   *
   * @public
   */
  setLoaderOptions(name: string, options: Object = {}) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).options) {
      this.loader.get(name).options = new Map()
    }

    for(let key in options) {
      this.setLoaderOption(key, options[key])
    }

    return this
  }

  /**
   * clear loader options
   *
   * @public
   */
  clearLoaderOptions(name: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).options) {
      this.loader.get(name).options = new Map()
    }

    this.loader.get(name).options.clear()
    return this
  }

  /**
   * set loader option by key&value
   *
   * @public
   */
  setLoaderOption(name: string, key: string, value: *) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).options) {
      this.loader.get(name).options = new Map()
    }

    this.loader.get(name).options.set(key, value)
    return this
  }

  /**
   * delete loader option by key
   *
   * @public
   */
  deleteLoaderOption(name: string, key: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).options) {
      this.loader.get(name).options = new Map()
    }

    this.loader.get(name).options.delete(key)
    return this
  }

  /**
   * set loader loaders
   *
   * @public
   */
  setLoaderLoaders(name: string, loaders: string | Loader | Array<string | Loader> = []) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Map()
    }

    [...loaders].forEach(loader => {
      if('string' === loader) {
        this.addLoaderLoader(name, loader)
      } else {
        this.addLoaderLoader(name, loader.loader, loader.options)
      }
    })
    return this
  }

  /**
   * clear loader loaders
   *
   * @public
   */
  clearLoaderLoaders(name: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Map()
    }

    this.loader.get(name).loaders.clear()
    return this
  }

  /**
   * add loader loader
   *
   * @public
   */
  addLoaderLoader(name: string, loader: string, options?: Object) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Map()
    }

    this.loader.get(name).loaders.set(loader, new Map())

    if(options) {
      this.setLoaderLoaderOptions(name, loader, options)
    }

    return this
  }

  /**
   * delete loader's loader by loader name
   *
   * @public
   */
  deleteLoaderLoader(name: stirng, loader: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Map()
    }

    this.loader.get(name).loaders.delete(loader)
    return this
  }

  /**
   * set loader's loader options
   *
   * @public
   */
  setLoaderLoaderOptions(name: string, loader: string, options: Object) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Map()
    }

    if(!this.loader.get(name).loaders.has(loader)) {
      this.loader.get(name).loaders.set(loader, new Map())
    }

    for(let key in options) {
      const item = options[key]
      this.setLoaderLoaderOption(name, loader, key, item)
    }

    return this
  }

  /**
   * clear all loader's loader options
   *
   * @public
   */
  clearLoaderLoaderOptions(name: string, loader: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Map()
    }

    if(!this.loader.get(name).loaders.has(loader)) {
      this.loader.get(name).loaders.set(loader, new Map())
    }

    this.loader.get(name).loaders.get(loader).clear()
    return this
  }

  /**
   * set loader's loader option by key/value
   *
   * @public
   */
  setLoaderLoaderOption(name: string, loader: string, key: string, value: *) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Set()
    }

    if(!this.loader.get(name).loaders.has(loader)) {
      this.loader.get(name).loaders.set(loader, new Map())
    }

    this.loader.get(name).loaders.get(loader).set(key, value)
    return this
  }

  /**
   * delete loader's loader option by key
   *
   * @public
   */
  deleteLoaderLoaderOption(name: string, loader: string, key: string) {
    if(!this.loader.has(name)) {
      this.setLoader(name)
    }

    if(!this.loader.get(name).loaders) {
      this.loader.get(name).loaders = new Set()
    }

    if(!this.loader.get(name).loaders.has(loader)) {
      this.loader.get(name).loaders.set(loader, new Map())
    }

    this.loader.get(name).loaders.get(loader).delete(key)
    return this
  }


  /**
   * transform this.loader to webpack.module.rules
   *
   * @private
   */
  _transformLoader() {
    const rules = []

    //Object.keys(this.loader).forEach(key => {
    this.loader.forEach(({ files, loaders, options }, name) => {
      const test = new RegExp(`\\.(${Array.from(files).join('|')})$`)

      const opts = {}
      options.forEach((value, key) => {
        opts[key] = value
      })

      const use = []
      loaders.forEach((loaderOptions, loaderName) => {
        const loaderOpts = {}
        loaderOptions.forEach((value, key) => {
          loaderOpts[key] = value
        })

        use.push({ loader: loaderName, options: loaderOptions })
      })

      rules.push({
        test,
        use,
        ...opts
      })
    })

    console.log(rules)

    this.set(`module.rules`, rules, true)

    return this
  }

  setPlugin(name, constructor, options? = {}) {
    this.plugin[name] = {
      constructor: constructor || this.plugin[name].constructor,
      options: options || this.plugin[name].options
    }

    return this
  }

  removePlugin(name) {
    delete this.plugin[name]
    return this
  }

  setPluginOptions(name, options? = {}) {
    this.plugin[name].options = {
      ...this.plugin[name].options,
      ...options
    }
    return this
  }

  setPluginOption(name, key: string, value: *) {
    this.plugin[name].options[key] = value
    return this
  }

  deletePluginOption(name, key: string) {
    delete this.plugin[name].options[key]
    return this
  }

  _transformPlugin() {
    const plugins = []

    Object.keys(this.plugin).forEach(key => {
      const { constructor, options } = this.plugin[key]
      plugins.push(new constructor(options))
    })

    return this.set(`plugins`, plugins, true)
  }

  /**
   * set library
   *
   * @public
   */
  setLib(name: string, { version, root }: LibProperty = {}) {
    this.libs.set(name, {
      version: version || this.deps[name],
      root: root || suggestLibraryRootName(name)
    })

    return this
  }

  /**
   * transform library to options
   *
   * @private
   */
  _transformLib() {
    const scripts = []

    this.libs.forEach(({ version, root }, name) => {
      this.set(`externals.${name}`, root)
      scripts.push(`https://unpkg.com/${exportPath(name).replace(/\.\/node_modules\//, '')}`)
    })

    this.setPluginOptions('html', {
      scripts
    })

    // console.log(this)

    return this
  }

  set(key: string, value: *, internal: boolean = false) {

    if(!internal) {
      if(/^entry/.test(key)) {
        console.warn(
          `Maybe you set controlled option "option.entry" \
by "build.set()" method, It better replaced by "build.setEntry()"`
        )
      } else if(/^output\.path/.test(key)) {
        console.warn(
          `Maybe you set controlled option "option.output.path" \
by "build.set()" method, It better replaced by "build.setOutput()"`
        )
      } else if(/^context/.test(key)) {
        console.warn(
          `Maybe you set controlled option "option.context" \
by "build.set()" method, It better replaced by "build.setContext()"`
        )
      } else if(/^module.rules/.test(key)) {
        console.warn(
          `Maybe you set controlled option "option.module.rules" \
by "build.set()" method, It better replaced by "build.setLoader()"`
        )
      } else if(/^plugins/.test(key)) {
        console.warn(
          `Maybe you set controlled option "option.plugins" \
by "build.set()" method, It better replaced by "build.setPlugin()"`
        )
      } else if(/^resolve\.alias/.test(key)) {
        // console.warn(
//           `Maybe you set controlled option "option.resolve.alias" \
// by "build.set()" method, It better replaced by "build.setAlias()"`
//         )
      }
    }

    set(this.options, key, value)
    return this
  }

  inspect() {
    const entries = []

    this.entry.forEach(({ entry, prepends }, id) => {
      entries.push({ id, entry, prepends: Array.from(prepends) })
    })

    const loaders = []

    Object.keys(this.loader).forEach(key => {
      const { ext, loaders: lods, options } = this.loader[key]
      loaders.push({ id: key, ext, loaders: lods, options })
    })

    console.log(`
context
  ${this.context}

entry(${entries.length})
${entries.map(({ id, entry, prepends }) => `  ${id} => { entry: ${entry}, pres: ${prepends.toString()}}`).join('\n')}

output
  ${this.output}

rule(${loaders.length})
${loaders.map(({ id, ext, loaders: lods, options }) => `  ${id} => { ext: ${ext}, lods: ${lods.map(({ name, options: loaderOptions }) => `${name}, ${loaderOptions}`)}, options: ${options} }`).join('\n')}
`)
    return this
  }

  export(): Object {
    return this
      ._transformContext()
      ._transformOutput()
      ._transformEntry()
      ._transformLib()
      // ._transformLoader()
      ._transformPlugin()
      .options
  }
}

function convertToAbsolutePath(target: string, context?: string): string {
  return path.isAbsolute(target)
    ? target
    : (context
       ? path.resolve(context, target)
       : path.resolve(target))
}



function ensureFileOrDir(target: string, flag: 'file' | 'dir' = 'file'): void {
  if(!fs.existsSync(target)) {
    throw new Error(
      `Target path not exists, "${target}"`
    )
  }

  const stat = fs.statSync(target)

  switch(flag) {
    case 'file':
      if(!stat.isFile()) {
        throw new Error(
          `Target path not a file, "${target}"`
        )
      }

      return

    case 'dir':
      if(!stat.isDirectory()) {
        throw new Error(
          `Target path not a dir, "${target}"`
        )
      }

      return

    default:
      throw new Error(
        `Unknow flag "${flag}", should be "file" or "dir"`
      )
  }
}

function sourcemapAbsolutePath(info): string {
  const prepend = 'file:///'
  const fmt = 'win32' === process.platform
        ? path.resolve(info.resourcePath)
              .replace(/\\/g, '\/')
              .replace(/(\w):/, (_, a) => a.toUpperCase() + ':')
        : path.resolve(info.resourcePath)

  return info.allLoaders.length && !info.allLoaders.startsWith('css')
    ? prepend + fmt + `?${info.hash}`
    : prepend + fmt
}

function suggestLibraryRootName(input: string): string {
  return camelCase(input.split(/\//).slice(-1)[0])
    .replace(/^(\w)/, (_, a) => a.toUpperCase())
    .replace(/dom/ig, 'DOM')
}

function hint(flag: Hint): Function {
  switch(flag) {
    case true:
    case 'warn':
    case 'warngin':
      return console.warn
    case 'err':
    case 'error':
      return err => { throw new Error(err) }
    case false:
    case 'none':
    default:
      return () => {}
  }
}


function build() {
  return new Builder()
}


/// export

export default build


/// test

import assert from 'assert'
import sinon from 'sinon'

describe('script/webpack builder()', () => {

  afterEach(() => {
    sinon.restore()
  })

  /**
   * Builder._parseWebpackEntryOption()
   */

  it('Builder._parseWebpackEntryOption(), should parse entry, string type', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'foo',
        prepends: new Set()
      }]]),

      new Builder({
        entry: 'foo'
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, array type', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set(['foo'])
      }]]),

      new Builder({
        entry: ['foo', 'bar']
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, array type only one element', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'foo',
        prepends: new Set()
      }]]),

      new Builder({
        entry: ['foo']
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, function type', () => {
    const ref = () => 'foo'
    assert.deepStrictEqual(
      new Map([['main', {
        entry: ref,
        prepends: new Set()
      }]]),

      new Builder({
        entry: ref
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, function type got a warning', () => {
    const ref = () => 'foo'
    const mock = sinon.mock(console).expects('warn').once()
    new Builder({ entry: ref })
    assert(mock.verify())
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, object type', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Builder({
        entry: {
          foo: 'bar'
        }
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, object type, multi properties', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: 'bar',
        prepends: new Set()
      }], ['baz', {
        entry: 'qux',
        prepends: new Set()
      }]]),

      new Builder({
        entry: {
          foo: 'bar',
          baz: 'qux'
        }
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, object type with array type element', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: 'baz',
        prepends: new Set(['bar'])
      }]]),

      new Builder({
        entry: {
          foo: ['bar', 'baz']
        }
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, object type with array type element, only one element', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Builder({
        entry: {
          foo: ['bar']
        }
      }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, object type when some prepends type not string', () => {
    assert.throws(
      () => new Builder({
        entry: {
          foo: [new Date(), 'bar']
        }
      }),
      /Array element type should be string/
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, null or undefined should pass', () => {
    assert.deepStrictEqual(
      new Map([]),
      new Builder({ }).entry
    )
  })

  it('Builder._parseWebpackEntryOption(), should parse entry, invaild type throw a error', () => {
    assert.throws(
      () => new Builder({
        entry: new Date()
      }),
      /Unknow webpack entry option type/
    )
  })

  /**
   * builer.setEntry()
   */

  it('Builder.setEntry(), should set entry', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set()
      }]]),

      new Builder().setEntry('main').entry
    )
  })

  it('Builder.setEntry(), should set entry show warning when not set entry property', () => {
    const mock = sinon.mock(console).expects('warn').once()
    new Builder().setEntry('main')
    assert(mock.verify())
  })

  it('Builder.setEntry(), should set entry with entry property', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'foo',
        prepends: new Set()
      }]]),

      new Builder().setEntry('main', {
        entry: 'foo'
      }).entry
    )
  })

  it('Builder.setEntry(), should set entry with prepends property', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set(['foo'])
      }]]),

      new Builder().setEntry('main', {
        prepends: ['foo']
      }).entry
    )
  })

  /**
   * Builder.clearEntry()
   */

  it('Builder.clearEntry(), should clear entry', () => {
    assert.deepStrictEqual(
      new Map([]),

      new Builder({
        entry: 'foo'
      }).clearEntry().entry
    )
  })

  /**
   * Builder.deleteEntry()
   */

  it('Builder.deleteEntry(), should remove entry by name', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: 'foo',
        prepends: new Set()
      }]]),

      new Builder({
        entry: {
          foo: 'foo',
          bar: 'bar'
        }
      }).deleteEntry('bar').entry
    )
  })

  /**
   * Builder.setEntryEntry()
   */

  it('Builder.setEntryEntry(), should set entry.entry', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set([])
      }]]),

      new Builder({
        entry: 'foo'
      }).setEntryEntry('main', 'bar').entry
    )
  })

  it('Builder.setEntryEntry(), should set entry.entry when not found name', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set([])
      }]]),

      new Builder().setEntryEntry('main', 'bar').entry
    )
  })

  /**
   * Builder.setEntryPrepends()
   */

  it('Builder.setEntryPrepends(), should override entry.prepends', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'qux',
        prepends: new Set(['foo', 'bar'])
      }]]),

      new Builder({
        entry: ['foo', 'bar', 'baz', 'qux']
      }).setEntryPrepends('main', ['foo', 'bar']).entry
    )
  })

  it('Builder.setEntryPrepends(), should set entry.prepends when name not found', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set(['foo', 'bar'])
      }]]),

      new Builder().setEntryPrepends('main', ['foo', 'bar']).entry
    )
  })

  /**
   * Builder.clearEntryPrepend()
   */
  it('Builder.clearEntryPrepends(), should clear entry.prepends', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Builder({
        entry: ['foo', 'bar']
      }).clearEntryPrepends('main').entry
    )
  })


  /**
   * Builder.addEntryPrepend()
   */

  it('Builder.addEntryPrepend(), should add entry.prepends', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set(['foo'])
      }]]),

      new Builder().addEntryPrepend('main', 'foo').entry
    )
  })

  /**
   * Builder.removeEntryPrepend()
   */

  it('Builder.removeEntryPrepend(), should remove entry.prepends', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set([])
      }]]),

      new Builder().deleteEntryPrepend('main', 'foo').entry
    )
  })

  /**
   * Builder._transformEntry()
   */

  it('Builder._transformEntry(), should transform entry, without prepends', () => {
    assert.deepStrictEqual(
      {
        main: 'foo'
      },

      new Builder({
        entry: 'foo'
      })._transformEntry().export().entry
    )
  })

  it('Builder._transformEntry(), should transform entry, with prepends', () => {
    assert.deepStrictEqual(
      {
        main: ['foo', 'bar']
      },

      new Builder({
        entry: ['foo', 'bar']
      })
        ._transformEntry().export().entry
    )
  })

  it('Builder._transformEntry(), should transform entry, ignore empty entry', () => {
    assert.deepStrictEqual(
      {
        foo: 'foo'
      },

      new Builder()
        .setEntry('foo', { entry: 'foo' })
        .setEntry('bar')
        ._transformEntry().export().entry
    )
  })

  it('Builder._transformEntry(), should transform entry, multi entry', () => {
    assert.deepStrictEqual(
      {
        foo: 'foo',
        bar: 'bar'
      },

      new Builder()
        .setEntry('foo', { entry: 'foo' })
        .setEntry('bar', { entry: 'bar' })
        ._transformEntry().export().entry
    )
  })

  it('Builder._transformEntry(), should transform entry, dyamic entry', () => {
    assert.deepStrictEqual(
      ['bar', 'baz'],

      new Builder()
        .setEntry('foo', { entry: a => a, prepends: ['bar', 'baz'] })
        ._transformEntry().export().entry.foo()
    )
  })
})

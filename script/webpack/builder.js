/**
 * webpack option builder
 *
 * @link [webpack option schemas](https://github.com/webpack/webpack/blob/master/schemas/WebpackOptions.json)
 * @flow
 */

import { set, isPlainObject, camelCase, defaults } from 'lodash'
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
  name: string,
  options: Object
}

type Loaders = {
  [name: string]: {
    name: string,
    options: Object
  }
}

type EntryProperty = {
  entry: string | (prepends?: Set<string>) => string,
  isFunction: boolean,
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

type Options = {
  disableDefaultOptions?: boolean
}

class Builder {
  context: ?string
  contextSetted: boolean
  entry: Entry
  entrySetted: boolean
  entryCommons: Set<string>
  output: string
  outputSetted: boolean
  loader: Loaders
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
    this.loader = {}
    this.plugin = {}
    this.options = {}
    this.opts = defaults(options, {
      disableDefaultOptions: false
    })
    this.libs = new Map()

    this
      ._parseWebpackOptions(webpackOptions)
      ._setDefaultOptions()
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
        {
          name: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => [
              postcssPresetEnv()
            ],
            options: {}
          }
        }
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
        {
          name: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => [
              postcssPresetEnv()
            ],
            options: {}
          }
        }
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
      .setPlugin('style', MiniCssExtractPlugin, {
        filename: this.isDev ? '[name].css' : '[name].[contenthash].css'
      })
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
      ._parserWebpackEntryOption(entry)
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
  _parserWebpackEntryOption(entry: $PropertyType<WebpackOptions, 'entry'>, name?: string = 'main') {
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

          this.setEntry(name, {
            prepends: entry.slice(0, -1),
            entry: entry.slice(-1)
          })

          break

        } else if(isPlainObject(entry)) {

          for(let key in entry) {
            this.parseWebpackOptions(entry[key], key)
          }

          break

        } else {
          throw new Error(
            `Unknow webpack entry option type "${objectType(entry)}"`
          )
        }
      }

      case 'function': {
        this.setEntry(name, {
          entry,
          isFunction: true
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

    if(!~['development', 'production', 'none'].indexOf(env)) {
      throw new Error(
        `The env should be "development", "production" or "none"`
      )
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
        extensions: ['.js']
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
  setEntry(name: string, { entry, isFunction, prepends = [] }: EntryProperty = {}) {
    if(this.entry.has(name)) {
      console.warn(
        `The entry "${name}" already exists, \
This operator will override the entry.${name}.

If you want to change entry path, you should call:

  builder.setEntryEntry()

or you want to change entry prepends, should call:

  builder.setEntryPrepends()

`
      )
    }

    if(!entry) {
      throw new Error(
        `The entry should provide`
      )
    } else if(prepends && !Array.isArray(prepends)) {
      throw new Error(
        `The entry prepends should be array`
      )
    }

    this.entry.set(name, {
      entry,
      isFunction: isFunction || 'function' === typeof entry,
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
     * if not have entry, generate one
     */
    if(!this.entry.has(name)) {
      this.setEntry(name, { entry })
    } else {
      this.entry.get(name).entry = entry
      this.entry.get(name).isFunction = 'function' === typeof entry
    }

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

    this.entry.get(name).prepends = new Set(prepends)

    return this
  }

  /**
   * clear entry prepends by name
   *
   * @public
   */
  clearEntryPrepends(name: string) {
    this.entry.get(name).prepends.clear()

    return this
  }

  /**
   * add entry prepend by name
   *
   * @public
   */
  addEntryPrepends(name: string, prepend: string) {
    this.entry.get(name).prepends.add(prepend)

    return this
  }

  /**
   * delete entry prepend by name
   *
   * @public
   */
  removeEntryPrepend(name: string, prepend: string) {
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

    this.entry.forEach(({ entry, isFunction, prepends }, name) => {
      const pres = [
        ...[...this.entryCommons],
        ...[...prepends]
      ].filter(Boolean)

      if(isFunction) {
        this.set(`entry.${name}`, entry(pres), true)
      } else {
        this.set(`entry.${name}`, [...pres, entry], true)
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

  setLoader(name: string, exts?: string, loaders?: Array<Loader> = [], options?: Object = {}) {
    this.loader[name] = {
      ext: exts || name
    }

    this.setLoaderLoaders(name, loaders)
    this.setLoaderOptions(name, options)

    return this
  }

  deleteLoader(name: string) {
    delete this.loader[name]
    return this
  }

  setLoaderOptions(name: string, options: Object = {}) {
    this.loader[name].options = options
    return this
  }

  deleteLoaderOptions(name: string) {
    delete this.loader[name].options
    return this
  }

  setLoaderOption(name: string, key: string, value: *) {
    this.loader[name].options[key] = value
    return this
  }

  deleteLoaderOption(name: string, key: string) {
    delete this.loader[name].options[key]
    return this
  }

  setLoaderLoaders(name: string, loaders: Array<Loader> = []) {
    this.loader[name].loaders = []
    for(let i = 0; i < loaders.length; i++) {
      this.addLoaderLoader(name, loaders[i])
    }
    return this
  }

  deleteLoaderLoaders(name: string) {
    delete this.loader[name].loaders
    return this
  }

  addLoaderLoader(name: string, loader: Loader) {
    this.loader[name].loaders.push(
      'string' === typeof loader
          ? { name: loader, options: {} }
          : loader
    )
    return this
  }

  removeLoaderLoader(name: string, loader: string) {
    return this.setLoader(
      name,
      undefined,
      this.loader[name].filter(
        ({ name: loaderName }) => loader !== loaderName
      )
    )
  }

  setLoaderLoaderOptions(name: string, loaderName: string, options: Object = {}) {
    return this.setLoader(
      name,
      undefined,
      /**
       * @TODO: should provide id or apply function to select loader
       */
      this.loader[name].map(loader => {
        if(loader.name !== loaderName) {
          return loader
        }

        loader.options = {
          ...loader.options,
          ...options
        }

        return loader
      })
    )
  }

  resetLoaderLoaderOptions(name: string, loaderName: string, options: Object = {}) {
    return this.setLoader(
      name,
      undefined,
      this.loader[name].map(loader => {
        if(loader.name !== loaderName) {
          return loader
        }

        loader.options = {}

        return loader
      })
    )
  }

  setLoaderLoaderOption(name: string, loaderName: string, key: string, value: *) {
    return this.setLoader(
      name,
      undefined,
      this.loader[name].map(loader => {
        if(loader.name !== loaderName) {
          return loader
        }

        loader.options[key] = value

        return loader
      })
    )
  }

  deleteLoaderLoaderOption(name: string, loaderName: string, key: string) {
    return this.setLoader(
      name,
      undefined,
      this.loader[name].map(loader => {
        if(loader.name !== loaderName) {
          return loader
        }

        delete loader.options[key]

        return loader
      })
    )
  }

  transformLoader() {
    const rules = []

    Object.keys(this.loader).forEach(key => {
      const { ext, loaders, options } = this.loader[key]
      const use = []

      loaders.forEach(({ name, options }) => {
        use.push(
          options && Object.keys(options)
            ? { loader: name, options }
            : name
        )
      })

      rules.push({
        test: new RegExp(`\\.${ext}$`),
        use,
        ...options
      })
    })

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

    console.log(this)

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

  report() {
    return this
  }

  export(): Object {
    return this
      ._transformContext()
      ._transformOutput()
      ._transformEntry()
      ._transformLib()
      .transformLoader()
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

function suggestLibraryUMDPath(lib: string): string {

}


function build() {
  return new Builder()
}


/// export

export default build


/// test

import assert from 'assert'

describe('script/webpack builder()', () => {
  it('should parse webpack option', () => {
    console.log(build().export())
    assert(true)
  })
})

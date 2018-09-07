/**
 * webpack option builder
 *
 * @flow
 */


import { set } from 'lodash'
import fs from 'fs'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin  from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import pkg from '../../package.json'

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

type Entries = {
  [name: string]: {
    path: string,
    prepends: Array<string>
  }
}

type Plugins = {
  [name: string]: {
    constructor: *,
    options: Object
  }
}

type Libraries = {
  [name: string]: {
    name: string
  }
}

class Builder {
  context: string
  contextSetted: boolean
  entry: Entries
  entryCommons: Array<string>
  loader: Loaders
  plugin: Plugins
  isDev: boolean

  constructor() {
    this.contextSetted = false
    this.entry = {}
    this.entryCommons = []
    this.loader = {}
    this.plugin = {}

    this
      .setDefaultOptions()
      .guessContext()
      .guessEntry()
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
        {
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
        title: pkg.description
      })
      .setPlugin('style', MiniCssExtractPlugin, {
        filename: this.isDev ? '[name].css' : '[name].[contenthash].css'
      })
  }

  setDefaultOptions() {
    const env = process.env.NODE_ENV || 'development'
    const isProd = 'production' === env
    this.isDev = !isProd

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
        devtoolModuleFilenameTemplate: sourcemapAbsolutePath
      },
      devtool: !isProd ? 'inline-source-map' : 'hidden-source-map',
      resolve: {
        unsafeCache: true,
        extensions: ['.js']
      }
    }

    /**
     * dev only
     */
    if(!isProd) {
      this.options = {
        ...this.options,

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
   * guess source context at initial
   */
  guessContext() {
    const dirExists = ['src', 'lib', '.']
          .map(dir => path.resolve(dir))
          .find(dir => fs.existsSync(dir))
    this.setContext(dirExists)
    return this
  }

  /**
   * set options.context
   */
  setContext(target: string) {
    const targetPath = convertToAbsolutePath(target)

    ensureFileOrDir(targetPath, 'dir')

    this.context = targetPath
    this.contextSetted = true
    this.set('context', this.context)
    this.guessEntry()
    this.setOutput(
      this.isDev
        ? convertToAbsolutePath('.', this.context)
        : convertToAbsolutePath('build', this.context)
    )

    return this
  }

  guessEntry() {
    const fileExists = ['boot.js', 'index.js']
          .map(file => convertToAbsolutePath(file, this.context))
          .find(file => fs.existsSync(file))

    if(fileExists) {
      this.setEntry('main', fileExists)
    }

    return this
  }

  setEntry(name: string, target?: string = '', prepends?: Array<string> = []) {
    if(prepends && !Array.isArray(prepends)) {
      throw new Error(
        `Entry prepends should be array`
      )
    }

    this.entry[name] = {
      target: target || this.entry[name].target,
      prepends: prepends || this.entry[name].prepends
    }

    return this
  }

  setEntryTarget(name: string, target: string) {
    return this.setEntry(name, target)
  }

  setEntryPrepends(name: string, prepends?: Array<string> = []) {
    return this.setEntry(name, undefined, prepends)
  }

  resetEntryPrepends(name: string) {
    return this.setEntryPrepends(name)
  }

  addEntryPrepends(name: string, prepend: string) {
    return this.setEntryPrepends(
      name,
      this.entry[name].prepends.concat(prepend)
    )
  }

  removeEntryPrepend(name: string, prepend: string) {
    return this.setEntryPrepends(
      name,
      this.entry.name.prepends.filter(pre => prepend !== pre)
    )
  }

  setEntryCommonPrepends(prepends?: Array<string> = []) {
    this.entryCommons = prepends
    return this
  }

  resetEntryCommonPrepends() {
    return this.setEntryCommonPrepends()
  }

  addEntryCommonPrepend(prepend: string) {
    return this.setEntryCommonPrepends(
      this.entryCommons.concat(prepend)
    )
  }

  removeEntryCommonPrepend(prepend: string) {
    return this.setEntryCommonPrepends(
      this.entryCommons.filter(pre => prepend !== pre)
    )
  }

  transformEntry() {
    Object.keys(this.entry).forEach(key => {
      this.set(`entry.${key}`, [].concat(
        this.entryCommons,
        this.entry[key].prepends,
        this.entry[key].target
      ).filter(Boolean))
    })

    return this
  }

  setOutput(target: string) {
    return this.set('output.path', convertToAbsolutePath(target))
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

    this.set(`module.rules`, rules)

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

  transformPlugin() {
    const plugins = []

    Object.keys(this.plugin).forEach(key => {
      const { constructor, options } = this.plugin[key]
      plugins.push(new constructor(options))
    })

    return this.set(`plugins`, plugins)
  }

  set(key: string, value: *) {
    set(this.options, key, value)
    return this
  }

  report() {
    return this
  }

  export(): Object {
    return this
      .transformEntry()
      .transformLoader()
      .transformPlugin()
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

function build() {
  return new Builder()
}


/// export

export default build


/// test

import assert from 'assert'

describe('script/webpack builder()', () => {
  it('should export webpack options', () => {
    console.log(build().export())
    assert(true)
  })
})

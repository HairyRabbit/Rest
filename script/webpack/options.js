/**
 * webpack default options
 */

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin  from 'mini-css-extract-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import pkg from '../../package.json'


/**
 * mode
 */
const env = process.env.NODE_ENV || 'development'
const isProd = 'production' === env

/**
 * entry
 */
const sourceDir = process.env.SOURCE_DIR || 'src'
const entryName = process.env.ENTRY_NAME || 'main'
const entryPrepend = process.env.ENTRY_PREPEND || ''
const entrySourceFile = process.env.ENTRY_SOURCE_FILE || './boot.js'

function createEntry() {
  return {
    [entryName]: [].concat(
      entryPrepend.split(','),
      entrySourceFile
    ).filter(Boolean)
  }
}

/**
 * output
 */
const buildDir = process.env.BUILD_DIR || (!isProd ? '.' : 'build')
const buildFileName = process.env.BUILD_FILENAME || (!isProd ? '[name].js' : '[name].[chunkhash].js')

/**
 * devtool
 */
const chromeWorkspaceIntegrate = process.env.CHROME_WORKSPACE_INTEGRATE || '1'
const webpackDevTool = process.env.WEBPACK_DEVTOOL || (!isProd ? 'inline-source-map' : 'hidden-source-map')

function sourcemapAbsolutePath(info) {
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

/**
 * module
 */
const scriptRule = [{
  test: /\.js$/,
  use: 'babel-loader?cacheDirectory'
}]

const postcssOptions = {
  plugins: () => [
    postcssPresetEnv()
  ],
  options: {}
}

const styleRule = [{
  test: /\.css$/,
  exclude: [/node_modules/],
  use: [
    !isProd ? 'style-loader?sourceMap' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 1,
        sourceMap: !isProd
      }
    },
    {
      loader: 'postcss-loader',
      options: postcssOptions
    }
  ]
},{
  test: /\.css$/,
  include: [/node_modules/],
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: false,
        importLoaders: 1,
        sourceMap: !isProd
      }
    },
    {
      loader: 'postcss-loader',
      options: postcssOptions
    }
  ]
}]

function createRules(...rules) {
  return [].concat(
    scriptRule,
    styleRule,
    rules
  )
}

/**
 * html
 */
const appTitle = process.env.APP_TITLE || pkg.description

const defaultOptions = {
  mode: env,
  context: sourceDir,
  entry: createEntry(),
  output: {
    path: path.resolve(buildDir),
    filename: buildFileName,
    devtoolModuleFilenameTemplate: parseInt(chromeWorkspaceIntegrate)
      ? sourcemapAbsolutePath
      : undefined
  },
  devtool: webpackDevTool,
  module: {
    rules: createRules()
  },
  resolve: {
    alias: {},
    unsafeCache: true,
    extensions: ['.js']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: !isProd ? '[name].css' : '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      title: appTitle
    })
  ]
}


/// export

export {
  createEntry,
  createRules
}

export default defaultOptions

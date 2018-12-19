/**
 * compressor and optimizer
 *
 * @see [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)
 * @see [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony)
 * @see [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin)
 * @see [terser](https://github.com/terser-js/terser)
 * @see [babel-minify-webpack-plugin](https://github.com/webpack-contrib/babel-minify-webpack-plugin)
 * @see [babel-minify](https://github.com/babel/minify)
 * @see [closure-webpack-plugin](https://github.com/webpack-contrib/closure-webpack-plugin)
 * @see [closure-compiler-js](https://github.com/google/closure-compiler-js)
 */

import webpack from 'webpack'
import { UglifyJsPluginOptions, ExtractCommentsOptions } from 'uglifyjs-webpack-plugin'

export enum Compressor {
  Uglify = 'uglify',
  Terser = 'terser',
  Closure = 'closure-compiler',
  Babel = 'babel-minify'
}

export interface ICompressor<Options> {
  readonly name: string
  readonly module: string
  options?: Options
}

const uglifyCompressor: ICompressor<UglifyJsPluginOptions> = {
  name: Compressor.Uglify,
  module: 'uglifyjs-webpack-plugin',
  options: {
    cache: true,
    parallel: true,
    sourceMap: true
  }
}

const terserCompressor: ICompressor<TerserWebpackPluginOptions> = {
  name: Compressor.Terser,
  module: 'terser-webpack-plugin',
  options: {
    cache: true,
    parallel: true,
    sourceMap: true
  }
}

const babelCompressor: ICompressor<BabelMinifyWebpackPluginOptions> = {
  name: Compressor.Babel,
  module: 'babel-minify-webpack-plugin'
}

const closureCompressor: ICompressor<closureWebpackPluginOptions> = {
  name: Compressor.Closure,
  module: 'closure-webpack-plugin'
}

export default {
  [Compressor.Uglify]: uglifyCompressor,
  [Compressor.Terser]: terserCompressor,
  [Compressor.Babel]: babelCompressor,
  [Compressor.Closure]: closureCompressor
}

interface TerserWebpackPluginOptions {
  test?: string | RegExp | RegExp[]
  include?: string | RegExp | RegExp[]
  exclude?: string | RegExp | (string | RegExp)[]
  cache?: boolean | string
  cacheKeys?: (defaultCacheKey: TerserWebpackPluginCacheKeyObject, file: string) => TerserWebpackPluginCacheKeyObject
  parallel?: boolean | number
  sourceMap?: boolean
  minify?: (file: string, sourceMap: object) => void
  terserOptions?: TerserOptions
  extractComments?: boolean | RegExp | ((node: object, comment: string) => boolean) | ExtractCommentsOptions
  warningsFilter?: (source: string) => boolean
}

interface TerserWebpackPluginCacheKeyObject {
  terser: string
  'terser-webpack-plugin': string
  'terser-webpack-plugin-options': TerserWebpackPluginOptions,
  path: string
  hash: (content: string) => string
}

interface TerserOptions {
  ie8?: boolean
  ecma?: number
  parse?: object
  mangle?: boolean | object
  output?: object
  compress?: boolean | object
  warnings?: boolean
  toplevel?: boolean
  nameCache?: object
  keep_classnames?: boolean
  keep_fnames?: boolean
  safari10?: boolean
}

interface BabelMinifyWebpackPluginOptions {
  test?: string | RegExp | RegExp[]
  include?: string | RegExp | RegExp[]
  exclude?: string | RegExp | (string | RegExp)[]
  sourceMap?: webpack.Configuration['devtool']
  comments?: boolean | RegExp | ((node: object, comment: string) => boolean) | ExtractCommentsOptions
  babel?: object
  parserOpts?: object
  minifyPreset?: (file: string, sourceMap: object) => void
}

/**
 * not impl
 */
interface babelMinifyOptions {

}

interface closureWebpackPluginOptions {
  platform?: 'native' | 'java' | 'javascript'
  mode?: 'STANDARD' | 'AGGRESSIVE_BUNDLE' | 'NONE'
  childCompilations?: boolean | ((compilation: any) => boolean)
  closureLibraryBase?: string
  deps?: string | Array<string>
  extraDeps?: { [filepath:string]: string }
}

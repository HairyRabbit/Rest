/**
 * babel preset, support features:
 *
 * - transform js by babel parser
 * - minify js by Terser (es6 friendly uglify)
 *
 * @flow
 */

import TerserPlugin from 'terser-webpack-plugin'
import typeof Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  if(!builder.babel) {
    builder.babel = new Babel()
    builder.export(builder.babel, [
      'addBabelPlugin'
    ])
  }

  builder
    .setRuleLoader('js', 'babel-loader')
    .setRuleLoaderOption('js', 'babel-loader', 'cacheDirectory', true)
    .setPluginProd('jsmin', TerserPlugin, {
      cache: true,
      parallel: true,
      sourceMap: true
    })

  return builder
}

class Babel {
  constructor() {
    this.plugins = new Set()
    this.presets = new Set()
  }
  addBabelPlugin() {
    return this
  }
}


/// export
export const dependencies = [
  'babel-loader',
  '@babel/core',
  '@babel/preset-env'
]
export default preset

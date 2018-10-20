/**
 * babel
 *
 * babel preset
 *
 * @flow
 */

import TerserPlugin from 'terser-webpack-plugin'
import Builder from '../'


/// code

function preset(builder: Builder): Builder {
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


/// export
export const dependencies = [
  'babel-loader',
  '@babel/core',
  '@babel/preset-env'
]
export default preset

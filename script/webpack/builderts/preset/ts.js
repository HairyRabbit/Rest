/**
 * Preset for typescript
 *
 * @flow
 */

import TerserPlugin from 'terser-webpack-plugin'
// import CheckerPlugin from 'awesome-typescript-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'


/// code

export default function preset(builder: *): * {
  builder
    .setRuleTypes('ts', ['ts', 'tsx'])
    .setRuleLoader('ts', 'ts-loader', {
      options: {
        transpileOnly: true
      }
    })
    // .setRuleLoaderOption('ts', 'babel-loader', 'cacheDirectory', true)
  // .setPlugin('tschecker', CheckerPlugin)
    .setPlugin('ts', ForkTsCheckerWebpackPlugin, {

    })
    .setPluginProd('tsmin', TerserPlugin, {
      cache: true,
      parallel: true,
      sourceMap: true
    })

  return builder
}

export const dependencies = [
  // 'awesome-typescript-loader',
  'ts-loader',
  'terser-webpack-plugin',
  '@babel/core',
  '@babel/preset-env',
  '@babel/preset-typescript'
]

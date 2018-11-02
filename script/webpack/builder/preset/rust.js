/**
 * rust
 *
 * rust wasm preset
 *
 * @flow
 */

/// code

export default function preset(builder: *): * {
  builder
    .setRuleLoader('js', 'babel-loader')
    .setRuleLoaderOption('js', 'babel-loader', 'cacheDirectory', true)

    // .setPluginProd('jsmin', TerserPlugin, {
    //   cache: true,
    //   parallel: true,
    //   sourceMap: true
    // })

  return builder
}

export const dependencies = [
  'babel-loader',
  '@babel/core',
  '@babel/preset-env'
]

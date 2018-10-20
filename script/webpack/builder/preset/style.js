/**
 * style
 *
 * css resolver preset
 *
 * @flow
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import Builder from '../'


/// code

function preset(builder: Builder): Builder {
  const { gcssEntry } = builder.options

  builder
    .setRuleLoaderDev('css', 'style-loader')
    .setRuleLoaderProd('css', 'style-loader', {
      name: MiniCssExtractPlugin.loader
    })
    .setRuleLoader('css', 'css-loader')
    .setRuleLoader('css', 'postcss-loader')
    .setRuleLoader('css', 'sass-loader')

  builder
    .setRuleLoaderOption('css', 'style-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'css-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'postcss-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'sass-loader', 'sourceMap', true)

  /**
   * setup css module
   */
  builder
    .setRuleLoaderOption('css', 'css-loader', 'modules', true)
    .setRuleLoaderOption('css', 'css-loader', 'importLoaders', 2)
    .setRuleLoaderOptionDev('css', 'css-loader', 'localIdentName', '[local]-[hash:base64:5]')
    .setRuleLoaderOptionProd('css', 'css-loader', 'localIdentName', '[hash:base64:5]')

  /**
   * setup postcss parser and plugins
   */
  builder
    .setRuleLoaderOption('css', 'postcss-loader', 'options', {})
    .setRuleLoaderOption('css', 'postcss-loader', 'plugins', [
      postcssPresetEnv()
    ])

  /**
   * setup sass
   */
  builder
    .setRuleLoaderOption('css', 'sass-loader', 'data', `$env: ${process.env.NODE_ENV};`)


  /**
   * if gcssEntry was set, add gcss rule
   */
  if(gcssEntry) {
    builder
      .setRuleOption('css', 'exclude', gcssEntry)
      .setRuleOption('gcss', 'include', gcssEntry)
      .setRuleTypes('gcss', ['css'])
      .setRuleLoaderDev('gcss', 'style-loader')
      .setRuleLoaderProd('gcss', 'style-loader', {
        name: MiniCssExtractPlugin.loader
      })
      .setRuleLoader('gcss', 'css-loader')
      .setRuleLoader('gcss', 'postcss-loader')
      .setRuleLoader('gcss', 'sass-loader')
      .setRuleLoaderOption('gcss', 'style-loader', 'sourceMap', true)
      .setRuleLoaderOption('gcss', 'css-loader', 'sourceMap', true)
      .setRuleLoaderOption('gcss', 'css-loader', 'importLoaders', 2)
      .setRuleLoaderOptionDev('gcss', 'css-loader', 'localIdentName', '[local]-[hash:base64:5]')
      .setRuleLoaderOption('gcss', 'postcss-loader', 'sourceMap', true)
      .setRuleLoaderOption('gcss', 'postcss-loader', 'options', {})
      .setRuleLoaderOption('gcss', 'sass-loader', 'sourceMap', true)
      .setRuleLoaderOption('gcss', 'sass-loader', 'data', `$env: ${process.env.NODE_ENV};`)
  }

  return builder
}


/// export

export const dependencies = [
  'css-loader',
  'style-loader',
  'postcss-loader',
  'sass-loader',
  'mini-css-extract-plugin',
  'optimize-css-assets-webpack-plugin'
]
export default preset

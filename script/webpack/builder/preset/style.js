/**
 * style
 *
 * css resolver, features:
 *
 * 1. css modules by default, non-modules also works fine
 * 2. sass parser and autoprefix by postcss
 * 3. hmr
 * 4. minify code at production mode
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

  setupLoader(builder, 'css')
  setupSourceMap(builder, 'css')
  setupCss(builder, 'css')
  setupPostcss(builder, 'css')
  setupSass(builder, 'css')

  /**
   * setup css module
   */
  builder
    .setRuleLoaderOption('css', 'css-loader', 'modules', true)
    .setRuleLoaderOptionDev('css', 'css-loader', 'localIdentName', '[local]-[hash:base64:5]')
    .setRuleLoaderOptionProd('css', 'css-loader', 'localIdentName', '[hash:base64:5]')


  /**
   * if gcssEntry was set, add gcss rule
   */
  if(gcssEntry) {
    builder
      .setRuleOption('css', 'exclude', gcssEntry)
      .setRuleOption('gcss', 'include', gcssEntry)

    /**
     * same as "css"
     */
    builder
      .setRuleTypes('gcss', ['css'])

    setupLoader(builder, 'gcss')
    setupSourceMap(builder, 'gcss')
    setupCss(builder, 'gcss')
    setupPostcss(builder, 'gcss')
    setupSass(builder, 'gcss')
  }

  builder
    .setPluginProd('css', MiniCssExtractPlugin, {
      filename: '[name].[chunkhash].css'
    })
    .setPluginProd('cssmin', OptimizeCSSAssetsPlugin, {
      sourceMap: true,
      cssProcessorOptions: {
        map: {
          inline: false,
          annotation: false
        }
      }
    })


  function setupLoader(builder: Builder, name: string): void {
    builder
      .setRuleLoaderDev(name, 'style-loader')
      .setRuleLoaderProd(name, 'style-loader', {
        name: MiniCssExtractPlugin.loader
      })
      .setRuleLoader(name, 'css-loader')
      .setRuleLoader(name, 'postcss-loader')
      .setRuleLoader(name, 'sass-loader')
  }

  function setupSourceMap(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOption(name, 'style-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'css-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'postcss-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'sass-loader', 'sourceMap', true)
  }

  function setupCss(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOption('name', 'css-loader', 'importLoaders', 2)
  }

  function setupPostcss(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOption(name, 'postcss-loader', 'options', {})
      .setRuleLoaderOption(name, 'postcss-loader', 'plugins', [
        postcssPresetEnv()
      ])
  }

  function setupSass(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOption(name, 'sass-loader', 'data', `$env: ${process.env.NODE_ENV};`)
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

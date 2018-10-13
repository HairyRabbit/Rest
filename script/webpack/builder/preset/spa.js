/**
 * spa
 *
 * configure spa project
 *
 * @flow
 */

import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import Builder from '../builder'
import smPathFmt from '../sourcemap-path-formatter'


/// code

function preset(builder: Builder): Builder {
  const { gcssEntry } = builder.options

  builder
    .set('target', 'web')
    .setDev('output.filename', '[name].js')
    .setProd('output.filename', '[name].[contenthash].js')
    .set('output.publicPath', '/')
    .set('output.devtoolModuleFilenameTemplate', smPathFmt)
    .setDev('devtool', 'inline-source-map')
    .setProd('devtool', 'hidden-source-map')
    .setRuleLoader('js', 'babel-loader')
    .setRuleLoaderOption('js', 'babel-loader', 'cacheDirectory', true)
    .setRuleLoaderDev('css', 'style-loader')
    .setRuleLoaderProd('css', 'style-loader', {
      name: MiniCssExtractPlugin.loader
    })
    .setRuleLoader('css', 'css-loader')
    .setRuleLoader('css', 'postcss-loader')
    .setRuleLoader('css', 'sass-loader')
    .setRuleLoaderOption('css', 'style-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'css-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'css-loader', 'modules', true)
    .setRuleLoaderOption('css', 'css-loader', 'importLoaders', 2)
    .setRuleLoaderOptionDev('css', 'css-loader', 'localIdentName', '[local]-[hash:base64:5]')
    .setRuleLoaderOptionProd('css', 'css-loader', 'localIdentName', '[hash:base64:5]')
    .setRuleLoaderOption('css', 'postcss-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'postcss-loader', 'options', {})
    .setRuleLoaderOption('css', 'sass-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'sass-loader', 'data', `$env: ${process.env.NODE_ENV};`)
    .setPlugin('html', HtmlWebpackPlugin, {
      template: HtmlWebpackTemplate,
      inject: false,
      mobile: true
    })
    .setPluginProd('css', MiniCssExtractPlugin, {
      filename: '[name].[chunkhash].css'
    })
    .setPluginProd('jsmin', TerserPlugin, {
      cache: true,
      parallel: true,
      sourceMap: true
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

export const install = 'server'
export default preset


/// test

import assert from 'assert'
import { inspect } from 'util'

describe('spa-preset', () => {
  it('should transform on development mode', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        target: 'web',
        devtool: 'inline-source-map',
        output: {
          filename: '[name].js',
          publicPath: '/',
          devtoolModuleFilenameTemplate: smPathFmt
        },
        module: {
          rules: [{
            test: /\.(js)$/,
            use: [{
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              }
            }]
          },{
            test: /\.(css)$/,
            use: [{
              loader: 'style-loader',
              options: {
                sourceMap: true
              }
            },{
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true,
                localIdentName: '[local]-[hash:base64:5]',
                sourceMap: true
              }
            },{
              loader: 'postcss-loader',
              options: {
                options: {},
                sourceMap: true
              }
            },{
              loader: 'sass-loader',
              options: {
                data: '$env: test;',
                sourceMap: true
              }
            }]
          }]
        },
        plugins: [
          new HtmlWebpackPlugin({
            template: HtmlWebpackTemplate,
            inject: false,
            mobile: true
          })
        ],
        devServer: {
          host: '0.0.0.0',
          port: '23333',
          publicPath: '/',
          historyApiFallback: true
        }
      },

      preset(
        Builder(null, { disableGuess: true })
          .setMode('development')
      ).transform()
    )
  })

  it.skip('should transform on production mode', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        target: 'web',
        devtool: 'hidden-source-map',
        output: {
          filename: '[name].[contenthash].js',
          publicPath: '/',
          devtoolModuleFilenameTemplate: smPathFmt
        },
        module: {
          rules: [{
            test: /\.(js)$/,
            use: [{
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              }
            }]
          },{
            test: /\.(css)$/,
            use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                sourceMap: true
              }
            },{
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true,
                sourceMap: true
              }
            },{
              loader: 'postcss-loader',
              options: {
                options: {},
                sourceMap: true
              }
            },{
              loader: 'sass-loader',
              options: {
                data: '$env: test;',
                sourceMap: true
              }
            }]
          }]
        },
        plugins: [
          new HtmlWebpackPlugin({
            template: HtmlWebpackTemplate,
            inject: false,
            mobile: true
          }),
          new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css'
          }),
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
      },

      preset(
        Builder(null, { disableGuess: true })
          .setMode('production')
      ).transform()
    )
  })
})

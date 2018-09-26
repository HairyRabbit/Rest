/**
 * spa-preset
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
import Builder from './builder'
import smPathFmt from './sourcemap-path-formatter'


/// code

function preset(builder) {
  return builder
    .set('target', 'web')
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
    .setRuleLoaderOption('css', 'style-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'css-loader', 'sourceMap', true)
    .setRuleLoaderOption('css', 'css-loader', 'modules', true)
    .setRuleLoaderOption('css', 'css-loader', 'importLoaders', 1)
    .setRuleLoaderOptionDev('css', 'css-loader', 'localIdentName', '[local]-[hash:base64:5]')
    .setRuleLoaderOption('css', 'postcss-loader', 'sourceMap', true)
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
    .setDev('devServer.host', '0.0.0.0')
    .setDev('devServer.port', '23333')
    .setDev('devServer.publicPath', '/')
    .setDev('devServer.historyApiFallback', true)
    // .setDev('devServer.contentBase', builder.context)
    // .setRuleLoaderDev('gcss', 'style-loader')
    // .setRuleLoaderProd('gcss', 'style-loader', {
    //   name: MiniCssExtractPlugin.loader
    // })
    // .setRuleLoader('gcss', 'css-loader')
    // .setRuleLoader('gcss', 'postcss-loader')
    // .setRuleLoaderOption('gcss', 'css-loader', 'sourceMap', true)
    // .setRuleLoaderOption('gcss', 'css-loader', 'importLoaders', 1)
    // .setRuleLoaderOption('gcss', 'postcss-loader', 'sourceMap', true)
    // .setRuleTypes('gcss', 'css')
    // .setRuleOptions('gcss', {
    //   include: /node_modules/
    // })
}


/// export

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
                importLoaders: 1,
                modules: true,
                localIdentName: '[local]-[hash:base64:5]',
                sourceMap: true
              }
            },{
              loader: 'postcss-loader',
              options: {
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
                importLoaders: 1,
                modules: true,
                sourceMap: true
              }
            },{
              loader: 'postcss-loader',
              options: {
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

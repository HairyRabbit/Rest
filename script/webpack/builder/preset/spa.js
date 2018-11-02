/**
 * spa
 *
 * configure spa project
 *
 * @flow
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'

/// code

export default function preset(builder: *): * {
  builder
    .set('target', 'web')
    .setPlugin('html', HtmlWebpackPlugin, {
      template: HtmlWebpackTemplate,
      inject: false,
      mobile: true
    })

  return builder
}


/// export

export const use = 'babel,style,server'


/// test

import assert from 'assert'
import { inspect } from 'util'

// describe('spa-preset', () => {
//   it('should transform on development mode', () => {
//     assert.deepStrictEqual(
//       {
//         mode: 'test',
//         target: 'web',
//         devtool: 'inline-source-map',
//         output: {
//           filename: '[name].js',
//           publicPath: '/',
//           devtoolModuleFilenameTemplate: smPathFmt
//         },
//         module: {
//           rules: [{
//             test: /\.(js)$/,
//             use: [{
//               loader: 'babel-loader',
//               options: {
//                 cacheDirectory: true
//               }
//             }]
//           },{
//             test: /\.(css)$/,
//             use: [{
//               loader: 'style-loader',
//               options: {
//                 sourceMap: true
//               }
//             },{
//               loader: 'css-loader',
//               options: {
//                 importLoaders: 2,
//                 modules: true,
//                 localIdentName: '[local]-[hash:base64:5]',
//                 sourceMap: true
//               }
//             },{
//               loader: 'postcss-loader',
//               options: {
//                 options: {},
//                 sourceMap: true
//               }
//             },{
//               loader: 'sass-loader',
//               options: {
//                 data: '$env: test;',
//                 sourceMap: true
//               }
//             }]
//           }]
//         },
//         plugins: [
//           new HtmlWebpackPlugin({
//             template: HtmlWebpackTemplate,
//             inject: false,
//             mobile: true
//           })
//         ],
//         devServer: {
//           host: '0.0.0.0',
//           port: '23333',
//           publicPath: '/',
//           historyApiFallback: true
//         }
//       },

//       preset(
//         Builder(null, { disableGuess: true })
//           .setMode('development')
//       ).transform()
//     )
//   })

//   it.skip('should transform on production mode', () => {
//     assert.deepStrictEqual(
//       {
//         mode: 'test',
//         target: 'web',
//         devtool: 'hidden-source-map',
//         output: {
//           filename: '[name].[contenthash].js',
//           publicPath: '/',
//           devtoolModuleFilenameTemplate: smPathFmt
//         },
//         module: {
//           rules: [{
//             test: /\.(js)$/,
//             use: [{
//               loader: 'babel-loader',
//               options: {
//                 cacheDirectory: true
//               }
//             }]
//           },{
//             test: /\.(css)$/,
//             use: [{
//               loader: MiniCssExtractPlugin.loader,
//               options: {
//                 sourceMap: true
//               }
//             },{
//               loader: 'css-loader',
//               options: {
//                 importLoaders: 2,
//                 modules: true,
//                 sourceMap: true
//               }
//             },{
//               loader: 'postcss-loader',
//               options: {
//                 options: {},
//                 sourceMap: true
//               }
//             },{
//               loader: 'sass-loader',
//               options: {
//                 data: '$env: test;',
//                 sourceMap: true
//               }
//             }]
//           }]
//         },
//         plugins: [
//           new HtmlWebpackPlugin({
//             template: HtmlWebpackTemplate,
//             inject: false,
//             mobile: true
//           }),
//           new MiniCssExtractPlugin({
//             filename: '[name].[chunkhash].css'
//           }),
//           new TerserPlugin({
//             cache: true,
//             parallel: true,
//             sourceMap: true
//           }),
//           new OptimizeCSSAssetsPlugin({
//             sourceMap: true,
//             cssProcessorOptions: {
//               map: {
//                 inline: false,
//                 annotation: false
//               }
//             }
//           })
//         ]
//       },

//       preset(
//         Builder(null, { disableGuess: true })
//           .setMode('production')
//       ).transform()
//     )
//   })
// }
//        )

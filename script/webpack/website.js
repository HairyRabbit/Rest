/**
 * configure for website build
 */

import fs from 'fs'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'

const env = process.env.NODE_ENV

export default {
  mode: env,
  entry: {
    main: [
      path.resolve('website/index.js')
    ]
  },
  output: {
    path: path.resolve('doc'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    },{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?modules'
      ]
    }]
  },
  resolve: {
    alias: {
      '~component': path.resolve('component')
    },
    unsafeCache: true,
    extensions: ['.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Rest framework & scaffold'
    })
  ]
}

/**
 * webpack.config.js
 *
 * library builder
 *
 * @flow
 */

import glob from 'glob'
import fs from 'fs'
import path from 'path'
import WebpackNodeExternals from 'webpack-node-externals'


/// code

export default {
  mode: process.env.NODE_ENV,
  target: 'node',
  node: false,
  context: path.resolve(__dirname),
  entry: {
    main: './index.js'
  },
  output: {
    path: path.resolve('lib'),
    filename: 'webpack-builder.js',
    library: 'WebpackBuilder',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  externals: [
    WebpackNodeExternals()
  ]
}

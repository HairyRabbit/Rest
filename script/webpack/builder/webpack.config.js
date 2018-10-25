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


/// code

const commons = {
  mode: 'production',
  target: 'node',
  node: false,
  output: {
    path: path.resolve('lib/webpack-builder'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
}

const presets = glob.sync(path.resolve(__dirname, 'preset') + '/*').map(p => {
  const filename = path.basename(p, path.extname(p))
  return {
    ...commons,
    entry: { filename: p }
  }
})

export default presets.concat({
  ...commons,
  entry: { index: path.resolve(__dirname, 'index.js') }
})

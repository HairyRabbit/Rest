/**
 * webpack.config.js
 *
 * library builder
 *
 * @flow
 */

import Builder from '../../../lib/webpack-builder'
import fs from 'fs'
import path from 'path'
import WebpackNodeExternals from 'webpack-node-externals'


/// code

export default Builder('lodash,text,nodelib')
  .setContext(__dirname)
  .setOutput(path.resolve('lib'))
  .set('optimization.noEmitOnErrors', true)
  .set('output.filename', 'webpack-builder.js')
  .transform()

// export default {
//   mode: process.env.NODE_ENV,
//   target: 'node',
//   node: false,
//   context: path.resolve(__dirname),
//   entry: {
//     main: './index.js'
//   },
//   output: {
//     path: path.resolve('lib'),
//     filename: 'webpack-builder.js',
//     library: 'WebpackBuilder',
//     libraryTarget: 'commonjs2'
//   },
//   module: {
//     rules: [
//       { test: /\.js$/, use: 'babel-loader' },
//       { test: /\.txt$/, use: 'raw-loader' }
//     ]
//   },
//   externals: [
//     WebpackNodeExternals()
//   ]
// }

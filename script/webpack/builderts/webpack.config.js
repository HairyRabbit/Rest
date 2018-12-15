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

export default Builder('ts,lodash,text,nodelib', {
  nodelib: {
    libraryName: 'webpack-builder-ts'
  }
}).setContext(__dirname)
  .setOutput(path.resolve('lib'))
  .transform()

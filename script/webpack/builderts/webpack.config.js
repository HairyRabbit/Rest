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

export default [
  Builder('ts,lodash,text,nodelib', {
    nodelib: {
      libraryName: 'webpack-builder-ts'
    }
  }).setContext(__dirname)
  .setOutput(path.resolve('lib'))
  .transform(),

  Builder('ts,lodash,text,nodelib', {
    nodelib: {
      libraryName: 'nodelib-pitch-loader'
    }
  }).setContext(__dirname)
  .setEntryModule(path.resolve(__dirname, 'src/presets/nodelib/loader.ts'), 'main')
  .renameEntry('main', 'nodelib-pitch-loader')
  .setOutput(path.resolve('lib'))
  .transform()
]

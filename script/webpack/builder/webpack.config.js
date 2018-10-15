/**
 * webpack.config.js
 *
 * library builder
 *
 * @flow
 */

import path from 'path'
import Builder from './'


/// code

export default Builder('babel,lib', {
  libraryTarget: 'commonjs2'
})
  .set('target', 'node')
  .setContext(__dirname)
  .setOutput(path.resolve('lib'))
  .set('output.filename', 'webpack-builder.js')
  // .set('output.libraryExport', ['default', ''])
  .set('node', false)
  // .set('externals', ['fs', 'path'])
  .transform()

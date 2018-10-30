/**
 * lib preset, for nodejs platform
 *
 * @flow
 */

import WebpackNodeExternals from 'webpack-node-externals'
import typeof Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  const { libraryName, libraryTarget = 'commonjs2' } = builder.options

  builder
    .set('output.libraryTarget', libraryTarget)
    .set('target', 'node')
    .set('node', false)
    .set('externals', WebpackNodeExternals())

  if(libraryName) {
    builder
      .set('library', libraryName)
  }

  return builder
}


/// export
export const dependencies = [
  'webpack-node-externals'
]

export default preset


/// test

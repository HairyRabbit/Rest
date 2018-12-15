/**
 * lib preset, for nodejs platform
 *
 * @flow
 */

import WebpackNodeExternals from 'webpack-node-externals'


/// code

export type Options = {
  libraryName?: string,
  libraryTarget?: string
}

export default function preset(builder: *): * {
  const {
    libraryName = 'main',
    libraryTarget = 'commonjs2',
    buildLibraries = []
  } = builder.options.nodelib || {}

  builder
    .set('name', libraryName)
    .renameEntry('main', libraryName)
    .set('output.filename', '[name].js')
    .set('output.library', libraryName)
    .set('output.libraryTarget', libraryTarget)
    .set('target', 'node')
    .set('node', false)
    .set('externals', WebpackNodeExternals())

  return builder
}

export const dependencies = [
  'webpack-node-externals'
]


/// test

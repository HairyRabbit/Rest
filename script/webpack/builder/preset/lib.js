/**
 * lib preset, used to build library
 *
 * @flow
 */

/// code

export default function preset(builder: *): * {
  const { libraryName, libraryTarget = 'umd' } = builder.options

  builder
    .set('output.libraryTarget', libraryTarget)
    .set('target', 'node')
    .set('node', 'false')

  return builder
}


/// test

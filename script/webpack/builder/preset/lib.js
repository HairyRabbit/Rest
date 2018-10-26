/**
 * lib preset, used to build library
 *
 * @flow
 */

import typeof Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  const { libraryName, libraryTarget = 'umd' } = builder.options

  builder
    .set('output.libraryTarget', libraryTarget)
    .set('target', 'node')
    .set('node', 'false')

  return builder
}


/// export

export default preset


/// test

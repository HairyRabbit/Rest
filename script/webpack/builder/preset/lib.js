/**
 * lib
 *
 * lib builder preset
 *
 * @flow
 */

import typeof Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  const { libraryName, libraryTarget = 'umd' } = builder.options

  builder
    .set('output.libraryTarget', libraryTarget)

  return builder
}


/// export

export default preset


/// test

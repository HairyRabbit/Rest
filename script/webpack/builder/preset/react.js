/**
 * react
 *
 * builder preset for react framework
 *
 * @flow
 */

import Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  return builder
}


/// export
export const dependencies = [
  ['react', 'P'],
  ['react-dom', 'P']
]
export default preset

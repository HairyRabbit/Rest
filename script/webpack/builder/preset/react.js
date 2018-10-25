/**
 * react
 *
 * builder preset for react framework
 *
 * @flow
 */

import typeof Builder from '../builder'


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

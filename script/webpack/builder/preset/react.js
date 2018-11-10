/**
 * react
 *
 * builder preset for react framework
 *
 * @flow
 */

import typeof Builder from '../builder'


/// code

export default function preset(builder: Builder): Builder {
  return builder
}

export const dependencies = [
  ['react', 'P'],
  ['react-dom', 'P']
]

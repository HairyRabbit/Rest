/**
 * icon
 *
 * icon preset
 *
 * @flow
 */

import typeof Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  builder
    .setRuleLoader('icon', 'babel-loader')
    .setRuleLoaderOption('icon', 'babel-loader', 'cacheDirectory', true)
    .setRuleLoader('icon', 'react-svg-loader')
    .setRuleTypes('icon', ['svg'])
  return builder
}


/// export
export const dependencies = [
  'react-svg-loader'
]
export default preset

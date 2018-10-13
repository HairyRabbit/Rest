/**
 * icon
 *
 * icon preset
 *
 * @flow
 */

import Builder from '../builder'


/// code

function iconPreset(builder: Builder): Builder {
  builder
    .setRuleLoader('icon', 'babel-loader')
    .setRuleLoaderOption('icon', 'babel-loader', 'cacheDirectory', true)
    .setRuleLoader('icon', 'react-svg-loader')
    .setRuleTypes('icon', ['svg'])
  return builder
}


/// export
export const dependencies = ['react-svg-loader']
export default iconPreset

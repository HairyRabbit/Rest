/**
 * icon
 *
 * icon preset
 *
 * @flow
 */

/// code

export default function preset(builder: *): * {
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

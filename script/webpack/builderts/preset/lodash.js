/**
 * lodash presets
 *
 * @flow
 */

import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'


/// code

export default function preset(builder: *): * {
  builder
    .setPlugin('lodash', LodashModuleReplacementPlugin)

  return builder
}


/// export
export const use = 'babel'
export const dependencies = [
  'lodash-webpack-plugin',
  'babel-plugin-lodash',
  'lodash'
]


/// test

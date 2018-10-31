/**
 * lodash presets
 *
 * @flow
 */

import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import typeof Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  builder
    .setPlugin('lodash', LodashModuleReplacementPlugin)

  return builder
}


/// export
export const install = 'babel'
export const dependencies = [
  'lodash-webpack-plugin',
  'babel-plugin-lodash',
  'lodash'
]
export default preset


/// test

/**
 * babel
 *
 * babel preset
 *
 * @flow
 */

import Builder from '../'


/// code

function preset(builder: Builder): Builder {
  builder
    .setRuleLoader('js', 'babel-loader')
    .setRuleLoaderOption('js', 'babel-loader', 'cacheDirectory', true)

  return builder
}


/// export

export default preset

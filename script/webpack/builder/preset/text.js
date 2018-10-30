/**
 * text preset, transform templates as raw string ,
 * the template use nunjucks, a powerful "jinja2"
 * like template system
 *
 * @flow
 */

import typeof Builder from '../builder'


/// code

function preset(builder: Builder): Builder {
  builder
    .setRuleLoader('txt', 'raw-loader')

  return builder
}


/// export

export const dependencies = [
  'raw-loader'
]

export default preset

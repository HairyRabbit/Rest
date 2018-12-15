/**
 * text preset, transform templates as raw string ,
 * the template use nunjucks, a powerful "jinja2"
 * like template system
 *
 * @todo impl jinja2 template system
 * @flow
 */

/// code

export default function preset(builder: *): * {
  builder
    .setRuleLoader('txt', 'raw-loader')

  return builder
}


/// export

export const dependencies = [
  'raw-loader'
]

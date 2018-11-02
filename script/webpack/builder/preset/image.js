/**
 * image preset, build images
 *
 * @flow
 */

/// code

export default function preset(builder: *): * {
  builder
    .setRuleLoader('img', 'url-loader', {
      options: {
        limit: 4096
      }
    })
    .setRuleLoader('img', 'image-webpack-loader', {
      options: {

      }
    })
    .setRuleTypes('img', ['jpg', 'jpeg', 'png', 'gif', 'webp'])
  // .setRuleOption('img', 'include', path.resolve(__dirname, 'assert'))

  return builder
}


/// export
export const dependencies = [
  'file-loader',
  'url-loader',
  ''
]

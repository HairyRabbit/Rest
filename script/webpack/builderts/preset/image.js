/**
 * image preset, build images
 *
 * @flow
 */

/// code

export default function preset(builder: *): * {
  builder
    .setRuleLoader('img', 'url-loader')
    .setRuleLoaderOptionProd('img', 'url-loader', 'limit', 4096)
    .setRuleLoaderProd('img', 'image-webpack-loader', {
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
  'url-loader'
]

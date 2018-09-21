/**
 * plugin parser
 *
 * parse webpackOptions.plugins
 *
 * @flow
 */

import type { Plugins } from 'webpack-options-type'


/// code

type Result = {
  name: string,
  constructor: Class,
  options: Object
}

function parse(plugins: Plugins = []): Array<Result> {
  return plugins
    .map(plugin => {
      const constructor = plugin.constructor

      plugin.constructor = class extends (plugin.constructor) {
        constructor(...args) {
          return args
        }
      }

      const options = new plugin.constructor()

    })
}



/// export

export default parse


/// test

describe('Function pluginParse', () => {
  it('parse plugin', () => {

  })
})

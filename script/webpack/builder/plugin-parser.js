/**
 * plugin parser
 *
 * parse webpackOptions.plugins
 *
 * @flow
 */

import type { Plugins } from './webpack-options-type'


/// code

type Result = {
  name: string,
  constructor: any,
  entity: any
}

function parse(plugins: Plugins = []): Array<Result> {
  return plugins.map(plugin => ({
    name: plugin.constructor.name,
    constructor: plugin.constructor,
    entity: plugin
  }))
}



/// export

export default parse


/// test

import assert from 'assert'

describe('Function pluginParse', () => {
  it('parse plugin', () => {
    class Foo { apply() {} }
    class Bar { apply() {} }
    const foo = new Foo
    const bar = new Bar

    assert.deepStrictEqual(
      [
        { name: 'Foo', constructor: Foo, entity: foo },
        { name: 'Bar', constructor: Bar, entity: bar }
      ],

      parse([ foo, bar ])
    )
  })

  it('parse plugin with options', () => {
    class Foo { apply() {} }
    const foo = new Foo()

    assert.deepStrictEqual(
      [
        { name: 'Foo', constructor: Foo, entity: foo },
      ],

      parse([ foo ])
    )
  })
})

/**
 * parse webpack options.plugins, just pick class constructor name
 *
 * @flow
 */

import type { Plugins } from './webpack-options-type'


/// code

type Result = {
  name: string,
  constructor: Function,
  entity: *
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

describe('Function pluginParse()', () => {
  it('parse plugin', () => {
    class Foo { apply() {} }
    class Bar { apply() {} }
    const foo = new Foo()
    const bar = new Bar()
    assert.deepStrictEqual(
      [{ name: 'Foo', constructor: Foo, entity: foo },
       { name: 'Bar', constructor: Bar, entity: bar }],
      parse([ foo, bar ])
    )
  })

  it('parse plugin with options', () => {
    class Foo {
      bar: number
      constructor(a) { this.bar = a }
      apply() {}
    }
    const foo = new Foo(42)
    const parsed = parse([ foo ])
    assert.deepStrictEqual(
      [{ name: 'Foo', constructor: Foo, entity: foo }],
      parsed
    )
    // $FlowFixMe
    assert.deepStrictEqual(42, parsed[0].entity.bar)
  })
})

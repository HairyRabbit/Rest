/**
 * plugin tools
 *
 * @flow
 */

import { isEmpty, isMap, isPlainObject } from 'lodash'
import parse from './plugin-parser'
import type { Plugin as WebpackPlugin } from './webpack-options-type'


/// code

class Plugin {
  value: Map<string, Map<number, { constructor: any, entity: any, options: Object }>>

  constructor(plugins?: WebpackPlugin) {
    this.value = new Map()

    if(plugins) {
      const parsed = parse(plugins)
      for(let i = 0; i < parsed.length; i++) {
        const { name, constructor, entity } = parsed[i]
        this[
          this.value.get(name) ? 'addPlugin' : 'setPlugin'
        ](name, constructor, undefined, entity)
      }
    }
  }

  ensure(name: string) {
    if(name && !this.value.get(name)) {
      this.value.set(name, new Map())
    }

    return this
  }

  setPlugin(name: string, constructor?: any, options?: Object, entity?: any) {
    return this
      .ensure(name)
      .clearPlugins(name)
      .addPlugin(name, constructor, options, entity)
  }

  deletePlugin(name: string) {
    this.ensure(name).value.delete(name)
    return this
  }

  clearPlugin() {
    this.value.clear()
    return this
  }

  /**
   * clear all plugins by name
   *
   * @private
   */
  clearPlugins(name: string) {
    this.ensure(name).value.get(name).clear()
    return this
  }

  addPlugin(name: string, constructor?: any, options?: Object, entity?: any) {
    this.ensure(name).value.get(name).set(this.value.get(name).size, {
      constructor,
      options: new Map(Object.entries(options || {})),
      entity
    })
    return this
  }

  setPluginOptions(name: string, options: Object) {
    const plugins = this.ensure(name).value.get(name)
    for(let [_, plugin] of plugins) {
      plugin.options = new Map(Object.entries(options || {}))
    }

    return this
  }

  clearPluginOptions(name: string) {
    const plugins = this.ensure(name).value.get(name)
    for(let [_, plugin] of plugins) {
      plugin.options.clear()
    }

    return this
  }

  setPluginOption(name: string, key: string, value: *) {
    const plugins = this.ensure(name).value.get(name)
    for(let [_, plugin] of plugins) {
      plugin.options.set(key, value)
    }

    return this
  }

  deletePluginOption(name: string, key: string) {
    const plugins = this.ensure(name).value.get(name)
    for(let [_, plugin] of plugins) {
      plugin.options.delete(key)
    }

    return this
  }

  transform(): WebpackPlugin {
    const acc = []

    this.value.forEach((set, name) => {
      set.forEach(({ constructor, entity, options }) => {
        if(!constructor) return

        if(isEmpty(options)) {
          if(!entity) return
          acc.push(entity)
        } else {
          const opt = {}
          options.forEach((value, key) => {
            opt[key] = value
          })
          acc.push(new constructor(opt))
        }
      })
    })

    return acc
  }
}


/// export

export default Plugin


/// test

import assert from 'assert'

describe('Class Plugin', () => {
  it('Plugin.constructor', () => {
    assert.deepStrictEqual(
      new Map(),

      new Plugin().value
    )
  })

  it('Plugin.constructor parse plugins', () => {
    class Foo {}
    class Bar {}
    const foo = new Foo()
    const bar = new Bar()

    assert.deepStrictEqual(
      new Map([
        ['Foo', new Map([
          [0, { constructor: Foo, entity: foo, options: new Map() }]
        ])],
        ['Bar', new Map([
          [0, { constructor: Bar, entity: bar, options: new Map() }]
        ])]
      ]),

      new Plugin([ foo, bar ]).value
    )
  })

  it('Plugin.constructor parse duplicate plugins', () => {
    class Foo {}
    const foo = new Foo()

    assert.deepStrictEqual(
      new Map([
        ['Foo', new Map([
          [0, { constructor: Foo, entity: foo, options: new Map() }],
          [1, { constructor: Foo, entity: foo, options: new Map() }]
        ])]
      ]),

      new Plugin([ foo, foo ]).value
    )
  })

  it('Plugin.setPlugin', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['foo', new Map([[0, {
          constructor: Foo,
          entity: undefined,
          options: new Map([
            ['bar', 42]
          ])
        }]])]
      ]),

      new Plugin()
        .setPlugin('foo', Foo, { bar: 42 })
        .value
    )
  })

  it('Plugin.setPlugin override by name', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['foo', new Map([[0, {
          constructor: Foo,
          entity: undefined,
          options: new Map([
            ['bar', 42]
          ])
        }]])]
      ]),

      new Plugin()
        .setPlugin('foo', Foo, { bar: 40 })
        .setPlugin('foo', Foo, { bar: 41 })
        .setPlugin('foo', Foo, { bar: 42 })
        .value
    )
  })

  it('Plugin.deletePlugin', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map(),

      new Plugin([ new Foo() ])
        .deletePlugin('Foo')
        .value
    )
  })

  it('Plugin.clearPlugin', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map(),

      new Plugin([ new Foo() ])
        .clearPlugin()
        .value
    )
  })

  it('Plugin.addPlugin', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['foo', new Map([
          [0, {
            constructor: Foo,
            entity: undefined,
            options: new Map([
              ['bar', 40]
            ])
          }],
          [1, {
            constructor: Foo,
            entity: undefined,
            options: new Map([
              ['bar', 41]
            ])
          }],
          [2, {
            constructor: Foo,
            entity: undefined,
            options: new Map([
              ['bar', 42]
            ])
          }]
        ])]
      ]),

      new Plugin()
        .addPlugin('foo', Foo, { bar: 40 })
        .addPlugin('foo', Foo, { bar: 41 })
        .addPlugin('foo', Foo, { bar: 42 })
        .value
    )
  })

  it('Plugin.clearPlugins', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['Foo', new Map()]
      ]),

      new Plugin([ new Foo() ])
        .clearPlugins('Foo')
        .value
    )
  })

  it('Plugin.setPluginOptions', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['Foo', new Map([[0, {
          constructor: Foo,
          entity: new Foo(),
          options: new Map([
            ['bar', 42]
          ])
        }]])]
      ]),

      new Plugin([ new Foo() ])
        .setPluginOptions('Foo', { bar: 42 })
        .value
    )
  })

  it('Plugin.clearPluginOptions', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['Foo', new Map([[0, {
          constructor: Foo,
          entity: new Foo(),
          options: new Map()
        }]])]
      ]),

      new Plugin([ new Foo() ])
        .setPluginOptions('Foo', { bar: 42 })
        .clearPluginOptions('Foo')
        .value
    )
  })

  it('Plugin.setPluginOption', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['Foo', new Map([
          [0, {
            constructor: Foo,
            entity: new Foo(),
            options: new Map([
              ['bar', 42]
            ])
          }],
          [1, {
            constructor: Foo,
            entity: new Foo(),
            options: new Map([
              ['bar', 42]
            ])
          }]
        ])]
      ]),

      new Plugin([ new Foo(), new Foo() ])
        .setPluginOption('Foo', 'bar', 42)
        .value
    )
  })

  it('Plugin.deletePluginOption', () => {
    class Foo {}

    assert.deepStrictEqual(
      new Map([
        ['Foo', new Map([
          [0, {
            constructor: Foo,
            entity: new Foo(),
            options: new Map()
          }]
        ])]
      ]),

      new Plugin([ new Foo() ])
        .setPluginOption('Foo', 'bar', 42)
        .deletePluginOption('Foo', 'bar')
        .value
    )
  })

  it('Plugin.transform', () => {
    class Foo {
      constructor(...args) {
        this.options = args
      }
    }

    assert.deepStrictEqual(
      [
        new Foo({ bar: 42 })
      ],

      new Plugin()
        .setPlugin('foo', Foo, { bar: 42 })
        .transform()
    )
  })

  it('Plugin.transform duplicate plugins', () => {
    class Foo {
      constructor(...options) {
        this.options = options
      }
    }

    assert.deepStrictEqual(
      [
        new Foo({ bar: 'baz' }),
        new Foo({ bar: 42 })
      ],

      new Plugin([
        new Foo({ bar: 'baz' }),
        new Foo({ bar: 42 })
      ]).transform()
    )
  })

  it('Plugin.transform override entity by options', () => {
    class Foo {
      constructor(...options) {
        this.options = options
      }
    }

    assert.deepStrictEqual(
      [
        new Foo({ bar: 42 })
      ],

      new Plugin([ new Foo() ])
        .setPluginOption('Foo', 'bar', 42)
        .transform()
    )
  })

  it('Plugin.transform ignore null constructor', () => {
    class Foo {
      constructor(...options) {
        this.options = options
      }
    }

    assert.deepStrictEqual(
      [

      ],

      new Plugin()
        .setPlugin('Foo')
        .transform()
    )
  })
})

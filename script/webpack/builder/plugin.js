/**
 * plugin tools
 *
 * @flow
 */

import { isEmpty, isMap, isPlainObject } from 'lodash'
import parse from './plugin-parser'
import { Builder } from './builder'
import type { Plugins as WebpackPlugin } from './webpack-options-type'


/// code

type Plugin$Option = Map<any, any>

type Plugin$Value = {
  constructor: any,
  entity: any,
  options: Plugin$Option
}

type Plugin$Name = string
type Plugin$Index = number

class Plugin {
  value: Map<Plugin$Name, Map<Plugin$Index, Plugin$Value>>

  constructor(plugins?: WebpackPlugin) {
    this.value = new Map()

    if(plugins) {
      /**
       * parse plugins, if plugin already set, add plugin to set
       * if not, set plugin first
       */
      parse(plugins).forEach(({ name, constructor, entity }) => {
        this.value.get(name)
          ? this.addPlugin(name, constructor, undefined, entity)
          : this.setPlugin(name, constructor, undefined, entity)
      })
    }
  }

  /**
   * ensure plugin avaiable by name
   *
   * @private
   */
  ensure(name: Plugin$Name) {
    if(name && !this.value.get(name)) this.value.set(name, new Map())
    const value = this.value.get(name)
    if(!value) throw new Error(`Plugin "${name}" not found`)
    return value
  }

  deletePlugin(name: string) {
    this.value.delete(name)
    return this
  }

  /**
   * clear all plugin
   */
  clearPlugin() {
    this.value.clear()
    return this
  }

  /**
   * clear all sub plugins by name
   */
  clearPlugins(name: string) {
    this.ensure(name).clear()
    return this
  }

  /**
   * add plugin, push plugin to set by name, the plugin shape:
   *
   * { 0: Plugin, 1: Plugin }
   */
  addPlugin(name: string, constructor?: any, options?: Object, entity?: any) {
    const plugins = this.ensure(name)
    plugins.set(plugins.size, {
      constructor,
      options: new Map(Object.entries(options || {})),
      entity
    })
    return this
  }

  /**
   * set plugin, just clearnPlugins + addPlugin
   */
  setPlugin(name: string, constructor?: any, options?: Object, entity?: any) {
    return this
      .clearPlugins(name)
      .addPlugin(name, constructor, options, entity)
  }

  ensurePlugin(name: string, index: number) {
    const plugins = this.ensure(name)
    const plugin = plugins.get(index)
    if(!plugin) throw new Error(`Unknow plugins[${index}]`)
    return plugin
  }

  setPluginOptions(name: string, options: Object, index?: number) {
    const plugins = this.ensure(name)
    if(index) {
      const plugin = this.ensurePlugin(name, index)
      plugin.options = new Map(Object.entries(options || {}))
      return this
    }

    for(let [_, plugin] of plugins) {
      plugin.options = new Map(Object.entries(options || {}))
    }
    return this
  }

  clearPluginOptions(name: string) {
    const plugins = this.ensure(name)
    for(let [_, plugin] of plugins) {
      plugin.options.clear()
    }

    return this
  }

  setPluginOption(name: string, key: string, value: *) {
    const plugins = this.ensure(name)
    for(let [_, plugin] of plugins) {
      plugin.options.set(key, value)
    }

    return this
  }

  deletePluginOption(name: string, key: string) {
    const plugins = this.ensure(name)
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

  static init(self: Builder): Builder {
    self.plugin = new Plugin(self.webpackOptions.plugins)
    return self.export(self.plugin, [
      'setPlugin',
      'deletePlugin',
      'clearPlugin',
      'setPluginOptions',
      'clearPluginOptions',
      'setPluginOption',
      'deletePluginOption'
    ])
  }

  static setOption(self: Builder): Builder {
    const options = self.plugin.transform()
    if(isEmpty(options)) return self
    return self._set('plugins', options)
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
    class Foo { apply() {} }
    class Bar { apply() {} }
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
    class Foo { apply() {} }
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
    class Foo { apply() {} }

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
    class Foo { apply() {} }

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
    class Foo { apply() {} }

    assert.deepStrictEqual(
      new Map(),

      new Plugin([ new Foo() ])
        .deletePlugin('Foo')
        .value
    )
  })

  it('Plugin.clearPlugin', () => {
    class Foo { apply() {} }

    assert.deepStrictEqual(
      new Map(),

      new Plugin([ new Foo() ])
        .clearPlugin()
        .value
    )
  })

  it('Plugin.addPlugin', () => {
    class Foo { apply() {} }

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
    class Foo { apply() {} }

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
    class Foo { apply() {} }

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
    class Foo { apply() {} }

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
    class Foo { apply() {} }

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
    class Foo { apply() {} }

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
      options: any
      constructor(...args) { this.options = args }
      apply() {}
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
      options: any
      constructor(...options) { this.options = options }
      apply() {}
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
      options: any
      constructor(...options) { this.options = options }
      apply() {}
    }

    assert.deepStrictEqual(
      [ new Foo({ bar: 42 }) ],
      new Plugin([ new Foo() ]).setPluginOption('Foo', 'bar', 42).transform()
    )
  })

  it('Plugin.transform ignore null constructor', () => {
    class Foo {
      options: any
      constructor(...options) { this.options = options }
      apply() {}
    }
    assert.deepStrictEqual([], new Plugin().setPlugin('Foo').transform())
  })
})

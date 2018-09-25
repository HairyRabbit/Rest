/**
 * rule tools
 *
 * @flow
 */

import { isEmpty } from 'lodash'
import type { Rule as WebpackRule } from './webpack-options-type'


/// code

type Loader = {
  loader: string,
  name?: string,
  options: Map<string, any>
}

class Rule {
  value: Map<string, {
    type: Set<string>,
    loaders: Map<string, Loader>,
    options: Map<string, any>
  }>

  constructor() {
    this.value = new Map()
  }

  ensure(name: string) {
    if(name && !this.value.get(name)) {
      this.setRule(name)
    }

    return this
  }

  ensureLoadersLoader(name: string, loader: string) {
    this.ensure(name)

    if(loader && !this.value.get(name).loaders.get(loader)) {
      this.setLoader(name, loader)
    }

    return this
  }

  setRule(name: string, loaders?: Array<Loader>, options?: Object, type?: string | Array<string>) {
    this.value.set(name, {
      loaders: new Map(),
      options: new Map(),
      type: new Set()
    })

    this.setLoaders(name, loaders)
    this.setOptions(name, options)
    this.setFileTypes(name, type)
    return this
  }

  deleteRule(name: string) {
    this.value.delete(name)
    return this
  }

  clearRule() {
    this.value.clear()
    return this
  }

  setFileTypes(name: string, type?: string | Array<string> = []) {
    this
      .ensure(name)
      .value.get(name)
      .type = new Set(Array.isArray(type) ? type : [type])

    return this
  }

  clearFileTypes(name: string) {
    this
      .ensure(name)
      .value.get(name)
      .type.clear()

    return this
  }

  addFileType(name: string, type: string) {
    this
      .ensure(name)
      .value.get(name)
      .type.add(type)

    return this
  }

  deleteFileType(name: string, type: string) {
    this
      .ensure(name)
      .value.get(name)
      .type.delete(type)

    return this
  }

  setRuleType(name: string, type: string | Array<string>) {
    this
      .ensure(name)
      .type = type

    return this
  }

  setLoaders(name: string, loaders?: Array<Loader> = []) {
    loaders.forEach(({ loader, name: loaderName, options }) => {
      this.setLoader(name, loader, {
        name: loaderName,
        options
      })
    })
    return this
  }

  clearLoaders(name: string) {
    this
      .ensure(name)
      .value.get(name).loaders
      .clear()

    return this
  }

  setLoader(name: string, loader: string, { name: loaderName, options } = {}) {
    this
      .ensure(name)
      .value.get(name).loaders
      .set(loader, {
        name: loaderName,
        options: new Map(Object.entries(options || {}))
      })

    return this
  }

  deleteLoader(name: string, loader: string) {
    this
      .ensure(name)
      .value.get(name).loaders
      .delete(loader)

    return this
  }

  setLoaderOptions(name: string, loader: string, options?: Object) {
    this
      .ensureLoadersLoader(name, loader)
      .value.get(name).loaders.get(loader)
      .options = new Map(Object.entries(options || {}))

    return this
  }

  clearLoaderOptions(name: string, loader: string) {
    this
      .ensureLoadersLoader(name, loader)
      .value.get(name).loaders.get(loader)
      .options.clear()

    return this
  }

  setLoaderOption(name: string, loader: string, key: string, value: *) {
    this
      .ensureLoadersLoader(name, loader)
      .value.get(name).loaders.get(loader)
      .options.set(key, value)

    return this
  }

  deleteLoaderOption(name: string, loader: string, key: string) {
    this
      .ensureLoadersLoader(name, loader)
      .value.get(name).loaders.get(loader)
      .options.delete(key)

    return this
  }

  setOptions(name: string, options: Object) {
    this
      .ensure(name)
      .value.get(name)
      .options = new Map(Object.entries(options || {}))

    return this
  }

  clearOptions(name: string) {
    this
      .ensure(name)
      .value.get(name)
      .options.clear()

    return this
  }

  setOption(name: string, key: string, value: *) {
    this
      .ensure(name)
      .value.get(name)
      .options.set(key, value)

    return this
  }

  deleteOption(name: string, key: string) {
    this
      .ensure(name)
      .value.get(name)
      .options.delete(key)

    return this
  }

  transform(): Array<WebpackRule> {
    const acc = []

    this.value.forEach(({ loaders, type, options }, name) => {
      const uses = []
      loaders.forEach(({ name: loaderName, options: loaderOptions }, loader) => {
        const loaderOpts = {}
        loaderOptions.forEach((optv, optk) => {
          loaderOpts[optk] = optv
        })

        uses.push({
          loader: loaderName || loader,
          options: loaderOpts
        })
      })

      const opts = {}
      options.forEach((optv, optk) => {
        opts[optk] = optv
      })

      const test = isEmpty(type)
            ? name
            : Array.from(type).join('|')

      acc.push({
        test: new RegExp(`\\.(${test})$`),
        use: uses,
        ...opts
      })
    })

    return acc
  }
}


/// export

export default Rule


/// test

import assert from 'assert'

describe('Class Rule', () => {
  it('Rule.constructor', () => {
    assert.deepStrictEqual(
      new Map(),

      new Rule()
        .value
    )
  })

  it('Rule.setRule', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map([
            ['babel-loader', {
              name: undefined,
              options: new Map([
                ['foo', 42]
              ])
            }]
          ]),
          options: new Map([
            ['exclude', /node_modules/]
          ]),
          type: new Set()
        }]
      ]),

      new Rule()
        .setRule(
          'js',
          [{
            loader: 'babel-loader',
            options: {
              foo: 42
            }
          }],
          {
            exclude: /node_modules/
          }
        )
        .value
    )
  })

  it('Rule.deleteRule', () => {
    assert.deepStrictEqual(
      new Map([
        ['css', {
          loaders: new Map(),
          options: new Map(),
          type: new Set()
        }]
      ]),

      new Rule()
        .setRule('js')
        .setRule('css')
        .deleteRule('js')
        .value
    )
  })

  it('Rule.clearRule', () => {
    assert.deepStrictEqual(
      new Map(),

      new Rule()
        .setRule('js')
        .setRule('css')
        .clearRule()
        .value
    )
  })

  it('Rule.setLoaders', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['foo', {
              name: undefined,
              options: new Map()
            }],
            ['bar', {
              name: undefined,
              options: new Map()
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoaders('js', [{
          loader: 'foo'
        },{
          loader: 'bar'
        }])
        .value
    )
  })

  it('Rule.clearLoaders', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map()
        }]
      ]),

      new Rule()
        .setLoaders('js', [{
          loader: 'foo'
        }])
        .clearLoaders('js')
        .value
    )
  })

  it('Rule.setLoader', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['babel-loader', {
              name: undefined,
              options: new Map()
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoader('js', 'babel-loader')
        .value
    )
  })

  it('Rule.setLoader with options', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['babel-loader', {
              name: 'foo',
              options: new Map([
                ['bar', 42]
              ])
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoader('js', 'babel-loader', {
          name: 'foo',
          options: {
            bar: 42
          }
        })
        .value
    )
  })

  it('Rule.deleteLoader', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['foo', {
              name: undefined,
              options: new Map()
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoaders('js', [{
          loader: 'foo'
        },{
          loader: 'bar'
        }])
        .deleteLoader('js', 'bar')
        .value
    )
  })

  it('Rule.setLoaderOptions', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['foo', {
              name: undefined,
              options: new Map([
                ['bar', 42]
              ])
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoaderOptions('js', 'foo', {
          bar: 42
        })
        .value
    )
  })

  it('Rule.clearLoaderOptions', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['foo', {
              name: undefined,
              options: new Map()
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoaderOptions('js', 'foo', {
          bar: 42
        })
        .clearLoaderOptions('js', 'foo')
        .value
    )
  })

  it('Rule.setLoaderOption', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['foo', {
              name: undefined,
              options: new Map([
                ['bar', 42]
              ])
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoaderOption('js', 'foo', 'bar', 42)
        .value
    )
  })

  it('Rule.deleteLoaderOption', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          options: new Map(),
          type: new Set(),
          loaders: new Map([
            ['foo', {
              name: undefined,
              options: new Map()
            }]
          ])
        }]
      ]),

      new Rule()
        .setLoaderOptions('js', 'foo', { bar: 42 })
        .deleteLoaderOption('js', 'foo', 'bar')
        .value
    )
  })

  it('Rule.setOptions', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          type: new Set(),
          options: new Map([
            ['bar', 42]
          ])
        }]
      ]),

      new Rule()
        .setOptions('js', { bar: 42 })
        .value
    )
  })

  it('Rule.clearOptions', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          type: new Set(),
          options: new Map()
        }]
      ]),

      new Rule()
        .setOptions('js', { bar: 42 })
        .clearOptions('js')
        .value
    )
  })

  it('Rule.setOption', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          type: new Set(),
          options: new Map([
            ['bar', 42]
          ])
        }]
      ]),

      new Rule()
        .setOption('js', 'bar', 42)
        .value
    )
  })

  it('Rule.deleteOption', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          type: new Set(),
          options: new Map([
            ['bar', 'baz']
          ])
        }]
      ]),

      new Rule()
        .setOptions('js', {
          foo: 42,
          bar: 'baz'
        })
        .deleteOption('js', 'foo')
        .value
    )
  })

  it('Rule.setFileTypes', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          options: new Map(),
          type: new Set(['foo', 'bar'])
        }]
      ]),

      new Rule()
        .setFileTypes('js', ['foo', 'bar'])
        .value
    )
  })

  it('Rule.clearFileTypes', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          options: new Map(),
          type: new Set()
        }]
      ]),

      new Rule()
        .setFileTypes('js', ['foo', 'bar'])
        .clearFileTypes('js')
        .value
    )
  })

  it('Rule.setFileTypes', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          options: new Map(),
          type: new Set(['foo', 'bar', 'baz'])
        }]
      ]),

      new Rule()
        .setFileTypes('js', ['foo', 'bar'])
        .addFileType('js', 'baz')
        .value
    )
  })

  it('Rule.deleteFileTypes', () => {
    assert.deepStrictEqual(
      new Map([
        ['js', {
          loaders: new Map(),
          options: new Map(),
          type: new Set(['foo'])
        }]
      ]),

      new Rule()
        .setFileTypes('js', ['foo', 'bar'])
        .deleteFileType('js', 'bar')
        .value
    )
  })

  it('Rule.transform', () => {
    assert.deepStrictEqual(
      [
        { test: /\.(js)$/, use: [] }
      ],

      new Rule()
        .setRule('js')
        .transform()
    )
  })

  it('Rule.transform transform loaders', () => {
    assert.deepStrictEqual(
      [{
        test: /\.(js)$/,
        use: [{
          loader: 'babel-loader',
          options: {}
        }]
      }],

      new Rule()
        .setRule('js', [
          { loader: 'babel-loader' }
        ])
        .transform()
    )
  })

  it('Rule.transform transform loaders with name', () => {
    assert.deepStrictEqual(
      [{
        test: /\.(js)$/,
        use: [{
          loader: 'babel-loader',
          options: {}
        }]
      }],

      new Rule()
        .setRule('js', [
          { loader: 'foo', name: 'babel-loader' }
        ])
        .transform()
    )
  })

  it('Rule.transform transform options', () => {
    assert.deepStrictEqual(
      [{
        test: /\.(js)$/,
        use: [],
        foo: 42
      }],

      new Rule()
        .setRule('js', undefined, { foo: 42 })
        .transform()
    )
  })

  it('Rule.transform transform type', () => {
    assert.deepStrictEqual(
      [{
        test: /\.(jpg|png)$/,
        use: []
      }],

      new Rule()
        .setRule('foo', undefined, undefined, ['jpg', 'png'])
        .transform()
    )
  })
})

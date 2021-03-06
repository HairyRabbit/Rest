/**
 * rule helpers and transformor, the rule shape:
 *
 * type - transform to rule.test, e.g. ['jpg', 'png'] => /\.(jpg|png)$/
 * loaders - transform to rule.use
 * options - transform rule options, like include, exclude
 * extract - not impl yet
 *
 * @link [webpack/lib/RuleSet](https://github.com/webpack/webpack/blob/master/lib/RuleSet.js)
 * @flow
 */

import { isEmpty } from 'lodash'
import parse from './rule-parser'
import { Builder } from './builder'
import type { Rule as WebpackRule } from './webpack-options-type'
// import ExtractTextPlugin from 'extract-text-webpack-plugin'


/// code

type Loader = {
  loader: string,
  name?: string,
  options?: Map<string, mixed>
}

type Value$Rule = {
  type: Set<string>,
  loaders: Map<string, { name?: string, options?: Map<string, mixed> }>,
  options: Map<string, mixed>,
  extract: boolean
}

type Value = Map<string, Value$Rule>

export default class Rule {
  noParsed: Array<WebpackRule>
  value: Value

  constructor(rules?: Array<WebpackRule>) {
    this.value = new Map()

    if(rules) {
      this.noParsed = []
      parse(rules).forEach(({ check, rule, loaders, options, type }) => {
        if(!check || !Array.isArray(type)) {
          this.noParsed.push(rule)
          return
        }

        this.setRule(type[0], loaders, options, type)
      })
    }
  }

  /**
   * rule
   */

  ensure(name: string): Value$Rule {
    if(name && !this.value.get(name)) this.setRule(name)
    const rule = this.value.get(name)
    if(!rule) throw new Error(`Unknow rule`)
    return rule
  }

  setRule(name: string,
          loaders?: Array<{ loader: string, options?: Object, name?: string }>,
          options?: Object,
          type?: string | Array<string>,
          extract: boolean = false) {
    this.value.set(name, {
      loaders: new Map(),
      options: new Map(),
      type: new Set(),
      extract
    })

    return this
      .setRuleLoaders(name, loaders)
      .setRuleOptions(name, options)
      .setRuleTypes(name, type)
  }

  deleteRule(name: string) {
    this.value.delete(name)
    return this
  }

  clearRule() {
    this.value.clear()
    return this
  }

  /**
   * rule type
   */

  setRuleTypes(name: string, type?: string | Array<string> = []) {
    this.ensure(name).type = new Set(
      Array.isArray(type) ? type : [type]
    )
    return this
  }

  clearRuleTypes(name: string) {
    this.ensure(name).type.clear()
    return this
  }

  addRuleType(name: string, type: string) {
    this.ensure(name).type.add(type)
    return this
  }

  deleteRuleType(name: string, type: string) {
    this.ensure(name).type.delete(type)
    return this
  }

  /**
   * rule loaders
   */

  setRuleLoaders(name: string, loaders?: Array<Loader> = []) {
    loaders.forEach(({ loader, name: loaderName, options }) => {
      this.setRuleLoader(name, loader, {
        name: loaderName,
        options
      })
    })
    return this
  }

  clearRuleLoaders(name: string) {
    this.ensure(name).loaders.clear()
    return this
  }

  ensureLoadersLoader(name: string, loader: string) {
    const rule = this.ensure(name)
    if(loader && !rule.loaders.get(loader)) this.setRuleLoader(name, loader)
    const ld = rule.loaders.get(loader)
    if(!ld) throw new Error(`Unknow loader`)
    return ld
  }

  setRuleLoader(name: string,
                loader: string,
                { name: loaderName, options = {} }: { name?: string, options?: Object } = {}) {
    this.ensure(name).loaders.set(loader, {
      name: loaderName,
      options: new Map(Object.entries(options || {}))
    })
    return this
  }

  deleteRuleLoader(name: string, loader: string) {
    this.ensure(name).loaders.delete(loader)
    return this
  }

  /**
   * rule loader options
   */
  ensureRuleLoaderOptions(name: string, loader: string): Map<string, mixed> {
    const ld = this.ensureLoadersLoader(name, loader)
    if(!ld.options) this.setRuleLoaderOptions(name, loader)
    const options = ld.options
    if(!options) throw new Error('Unknow rule loader options')
    return options
  }

  setRuleLoaderOptions(name: string, loader: string, options?: Object = {}) {
    const ld = this.ensureLoadersLoader(name, loader)
    ld.options = new Map(Object.entries(options))
    return this
  }

  clearRuleLoaderOptions(name: string, loader: string) {
    this.ensureRuleLoaderOptions(name, loader).clear()
    return this
  }

  setRuleLoaderOption(name: string, loader: string, key: string, value: *) {
    this.ensureRuleLoaderOptions(name, loader).set(key, value)
    return this
  }

  deleteRuleLoaderOption(name: string, loader: string, key: string) {
    this.ensureRuleLoaderOptions(name, loader).delete(key)
    return this
  }

  /**
   * rule options
   */
  ensureRuleOptions(name: string): Map<string, mixed> {
    const rule = this.ensure(name)
    if(!rule.options) this.setRuleOptions(name)
    const options = rule.options
    if(!options) throw new Error(`No options`)
    return rule.options
  }

  setRuleOptions(name: string, options?: Object = {}) {
    this.ensure(name).options = new Map(Object.entries(options))
    return this
  }

  clearRuleOptions(name: string) {
    this.ensureRuleOptions(name).clear()
    return this
  }

  setRuleOption(name: string, key: string, value: *) {
    this.ensureRuleOptions(name).set(key, value)
    return this
  }

  deleteRuleOption(name: string, key: string) {
    this.ensureRuleOptions(name).delete(key)
    return this
  }

  setRuleExtract(name: string, extract: boolean) {
    this.ensure(name).extract = extract
    return this
  }

  /**
   * transform to webpack options.module.rules
   */
  transform(): Array<WebpackRule> {
    const acc = []

    this.value.forEach(({ loaders, type, options, extract }, name) => {
      const uses = []

      loaders.forEach(({ name: loaderName, options: loaderOptions }, loader) => {
        const loaderOpts = {}

        if(loaderOptions) {
          loaderOptions.forEach((optv, optk) => {
            loaderOpts[optk] = optv
          })
        }

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

      /**
       * @todo ExtractTextPlugin should use multi times, like:
       * const extractOne = new ExtractTextPlugin('file.ext')
       */
      acc.push({
        test: new RegExp(`\\.(${test})$`),
        // use: extract
        //   ? ExtractTextPlugin.extract({ use: uses })
        //   : uses,
        use: uses,
        ...opts
      })
    })

    if(this.noParsed) {
      for(let i = 0; i < this.noParsed.length; i++) {
        acc.push(this.noParsed[i])
      }
    }

    return acc
  }

  static init(self: Builder): Builder {
    self.rule = new Rule(self.webpackOptions.module && self.webpackOptions.module.rules)
    return self.export(self.rule, [
      'setRule',
      'deleteRule',
      'clearRule',
      'setRuleTypes',
      'clearRuleTypes',
      'addRuleType',
      'deleteRuleType',
      'setRuleLoaders',
      'clearRuleLoaders',
      'setRuleLoader',
      'deleteRuleLoader',
      'setRuleLoaderOptions',
      'clearRuleLoaderOptions',
      'setRuleLoaderOption',
      'deleteRuleLoaderOption',
      'setRuleOptions',
      'clearRuleOptions',
      'setRuleOption',
      'deleteRuleOption',
      'setRuleExtract'
    ])
  }

  static setOption(self: Builder): Builder {
    const options = self.rule.transform()
    if(isEmpty(options)) return self
    return self._set('module.rules', options)
  }
}


/// test

import assert from 'assert'

describe('Class Rule', () => {
  it('Rule.constructor', () => {
    assert.deepStrictEqual(
      new Map(),
      new Rule().value
    )
  })

  // it('Rule.constructor parse rules', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['foo', {
  //         loaders: new Map(),
  //         options: new Map(),
  //         type: new Set()
  //       }],
  //       ['bar', {
  //         loaders: new Map([
  //           ['baz-loader', {
  //             name: undefined,
  //             options: new Map()
  //           }]
  //         ]),
  //         options: new Map(),
  //         type: new Set()
  //       }]
  //     ]),

  //     new Rule([
  //       { test: /\.foo$/ },
  //       { test: /\.bar$/, use: 'baz-loader' },
  //     ])
  //       .value
  //   )
  // })

  // it('Rule.setRule', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map([
  //           ['babel-loader', {
  //             name: undefined,
  //             options: new Map([
  //               ['foo', 42]
  //             ])
  //           }]
  //         ]),
  //         options: new Map([
  //           ['exclude', /node_modules/]
  //         ]),
  //         type: new Set()
  //       }]
  //     ]),

  //     new Rule()
  //       .setRule(
  //         'js',
  //         [{
  //           loader: 'babel-loader',
  //           options: {
  //             foo: 42
  //           }
  //         }],
  //         {
  //           exclude: /node_modules/
  //         }
  //       )
  //       .value
  //   )
  // })

  // it('Rule.deleteRule', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['css', {
  //         loaders: new Map(),
  //         options: new Map(),
  //         type: new Set()
  //       }]
  //     ]),
  //     new Rule()
  //       .setRule('js')
  //       .setRule('css')
  //       .deleteRule('js')
  //       .value
  //   )
  // })

  // it('Rule.clearRule', () => {
  //   assert.deepStrictEqual(
  //     new Map(),

  //     new Rule()
  //       .setRule('js')
  //       .setRule('css')
  //       .clearRule()
  //       .value
  //   )
  // })

  // it('Rule.setRuleLoaders', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['foo', {
  //             name: undefined,
  //             options: new Map()
  //           }],
  //           ['bar', {
  //             name: undefined,
  //             options: new Map()
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoaders('js', [{
  //         loader: 'foo'
  //       },{
  //         loader: 'bar'
  //       }])
  //       .value
  //   )
  // })

  // it('Rule.clearRuleLoaders', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map()
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoaders('js', [{
  //         loader: 'foo'
  //       }])
  //       .clearRuleLoaders('js')
  //       .value
  //   )
  // })

  // it('Rule.setRuleLoader', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['babel-loader', {
  //             name: undefined,
  //             options: new Map()
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoader('js', 'babel-loader')
  //       .value
  //   )
  // })

  // it('Rule.setRuleLoader with options', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['babel-loader', {
  //             name: 'foo',
  //             options: new Map([
  //               ['bar', 42]
  //             ])
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoader('js', 'babel-loader', {
  //         name: 'foo',
  //         options: {
  //           bar: 42
  //         }
  //       })
  //       .value
  //   )
  // })

  // it('Rule.deleteRuleLoader', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['foo', {
  //             name: undefined,
  //             options: new Map()
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoaders('js', [{
  //         loader: 'foo'
  //       },{
  //         loader: 'bar'
  //       }])
  //       .deleteRuleLoader('js', 'bar')
  //       .value
  //   )
  // })

  // it('Rule.setRuleLoaderOptions', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['foo', {
  //             name: undefined,
  //             options: new Map([
  //               ['bar', 42]
  //             ])
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoaderOptions('js', 'foo', {
  //         bar: 42
  //       })
  //       .value
  //   )
  // })

  // it('Rule.clearRuleLoaderOptions', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['foo', {
  //             name: undefined,
  //             options: new Map()
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoaderOptions('js', 'foo', {
  //         bar: 42
  //       })
  //       .clearRuleLoaderOptions('js', 'foo')
  //       .value
  //   )
  // })

  // it('Rule.setRuleLoaderOption', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['foo', {
  //             name: undefined,
  //             options: new Map([
  //               ['bar', 42]
  //             ])
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoaderOption('js', 'foo', 'bar', 42)
  //       .value
  //   )
  // })

  // it('Rule.deleteRuleLoaderOption', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         options: new Map(),
  //         type: new Set(),
  //         loaders: new Map([
  //           ['foo', {
  //             name: undefined,
  //             options: new Map()
  //           }]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleLoaderOptions('js', 'foo', { bar: 42 })
  //       .deleteRuleLoaderOption('js', 'foo', 'bar')
  //       .value
  //   )
  // })

  // it('Rule.setRuleOptions', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         type: new Set(),
  //         options: new Map([
  //           ['bar', 42]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleOptions('js', { bar: 42 })
  //       .value
  //   )
  // })

  // it('Rule.clearRuleOptions', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         type: new Set(),
  //         options: new Map()
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleOptions('js', { bar: 42 })
  //       .clearRuleOptions('js')
  //       .value
  //   )
  // })

  // it('Rule.setRuleOption', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         type: new Set(),
  //         options: new Map([
  //           ['bar', 42]
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleOption('js', 'bar', 42)
  //       .value
  //   )
  // })

  // it('Rule.deleteRuleOption', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         type: new Set(),
  //         options: new Map([
  //           ['bar', 'baz']
  //         ])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleOptions('js', {
  //         foo: 42,
  //         bar: 'baz'
  //       })
  //       .deleteRuleOption('js', 'foo')
  //       .value
  //   )
  // })

  // it('Rule.setRuleTypes', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         options: new Map(),
  //         type: new Set(['foo', 'bar'])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleTypes('js', ['foo', 'bar'])
  //       .value
  //   )
  // })

  // it('Rule.clearRuleTypes', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         options: new Map(),
  //         type: new Set()
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleTypes('js', ['foo', 'bar'])
  //       .clearRuleTypes('js')
  //       .value
  //   )
  // })

  // it('Rule.setRuleTypes', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         options: new Map(),
  //         type: new Set(['foo', 'bar', 'baz'])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleTypes('js', ['foo', 'bar'])
  //       .addRuleType('js', 'baz')
  //       .value
  //   )
  // })

  // it('Rule.deleteRuleTypes', () => {
  //   assert.deepStrictEqual(
  //     new Map([
  //       ['js', {
  //         loaders: new Map(),
  //         options: new Map(),
  //         type: new Set(['foo'])
  //       }]
  //     ]),

  //     new Rule()
  //       .setRuleTypes('js', ['foo', 'bar'])
  //       .deleteRuleType('js', 'bar')
  //       .value
  //   )
  // })

  // it('Rule.transform', () => {
  //   assert.deepStrictEqual(
  //     [
  //       { test: /\.(js)$/, use: [] }
  //     ],

  //     new Rule()
  //       .setRule('js')
  //       .transform()
  //   )
  // })

  // it('Rule.transform transform loaders', () => {
  //   assert.deepStrictEqual(
  //     [{
  //       test: /\.(js)$/,
  //       use: [{
  //         loader: 'babel-loader',
  //         options: {}
  //       }]
  //     }],

  //     new Rule()
  //       .setRule('js', [
  //         { loader: 'babel-loader' }
  //       ])
  //       .transform()
  //   )
  // })

  // it('Rule.transform transform loaders with name', () => {
  //   assert.deepStrictEqual(
  //     [{
  //       test: /\.(js)$/,
  //       use: [{
  //         loader: 'babel-loader',
  //         options: {}
  //       }]
  //     }],

  //     new Rule()
  //       .setRule('js', [
  //         { loader: 'foo', name: 'babel-loader' }
  //       ])
  //       .transform()
  //   )
  // })

  // it('Rule.transform transform options', () => {
  //   assert.deepStrictEqual(
  //     [{
  //       test: /\.(js)$/,
  //       use: [],
  //       foo: 42
  //     }],

  //     new Rule()
  //       .setRule('js', undefined, { foo: 42 })
  //       .transform()
  //   )
  // })

  // it('Rule.transform transform type', () => {
  //   assert.deepStrictEqual(
  //     [{
  //       test: /\.(jpg|png)$/,
  //       use: []
  //     }],

  //     new Rule()
  //       .setRule('foo', undefined, undefined, ['jpg', 'png'])
  //       .transform()
  //   )
  // })

  // it('Rule.transform append no parsed', () => {
  //   assert.deepStrictEqual(
  //     [{
  //       test: 'foo'
  //     }],

  //     new Rule([{ test: 'foo' }])
  //       .transform()
  //   )
  // })
})

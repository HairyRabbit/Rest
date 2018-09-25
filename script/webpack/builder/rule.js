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
    this.setFileType(name, type)
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

  setFileType(name: string, type?: string | Array<string> = []) {
    this
      .ensure(name)
      .value.get(name)
      .type = new Set(Array.isArray(type) ? type : [type])

    return this
  }

  clearFileType(name: string) {
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

  setLoaderOptions(name: string, loader: string, options: Object) {
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

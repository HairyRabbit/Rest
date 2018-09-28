/**
 * builder
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import { set, isEmpty, isFunction, camelCase, defaults } from 'lodash'
import Entry from './entry'
import Rule from './rule'
import Plugin from './plugin'
import readEnv from './read-env'
import type {
  WebpackOptions,
  Mode as WebpackMode,
  Entry as WebpackEntry
} from './webpack-options-type'


/// code

type Options = {
  disableGuess?: boolean
}

class Builder {
  webpackOptions: string | WebpackOptions
  option: Option
  mode: ?WebpackMode
  context: ?string
  output: ?string
  entry: Entry
  plugin: Plugin
  rule: Rule

  constructor(webpackOptions: webpackOptions, options: Options) {
    this.webpackOptions = 'string' === typeof webpackOptions
      ? {}
      : (webpackOptions || {})
    this.options = options || {}
    this.mode = this.webpackOptions.mode || this.guessMode()
    this.context = undefined
    this.output = undefined
    this.entry = new Entry(this.webpackOptions.entry)
    this.plugin = new Plugin(this.webpackOptions.plugin)
    this.rule = new Rule(this.webpackOptions.module && this.webpackOptions.module.rules)

    this
      .export(this, [
        'set',
        'setContext',
        'setOutput'
      ])
      .export(this.entry, [
        'setEntry',
        'deleteEntry',
        'clearEntry',
        'setEntryEntry',
        'setEntryPrepends',
        'clearEntryPrepends',
        'addEntryPrepend',
        'deleteEntryPrepend'
      ])
      .export(this.plugin, [
        'setPlugin',
        'deletePlugin',
        'clearPlugin',
        'setPluginOptions',
        'clearPluginOptions',
        'setPluginOption',
        'deletePluginOption'
      ])
      .export(this.rule, [
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
        'deleteRuleOption'
      ])

    if(!this.options.disableGuess) {
      this.guessContext()
    }

    if('string' === typeof webpackOptions) {
      require(`./preset/${webpackOptions}`).default(this)
      this.resetMode()
    }
  }

  setMode(mode: WebpackMode) {
    this.mode = mode
    return this
  }

  resetMode() {
    this.mode = undefined
    return this
  }

  guessMode(): WebpackMode {
    return readEnv('NODE_ENV') || 'development'
  }

  /**
   * @private
   */
  callWithMode(fn: Function, entity?: any, mode?: string): () => any {
    return (...args) => {
      if(mode && mode !== this.mode) return this
      fn.apply(entity || this, args)
      return this
    }
  }

  /**
   * @private
   */
  export(entity: any, fns: Array<string>) {
    fns.forEach(name => {
      const fn = entity[name].bind(entity)
      this[name] = this.callWithMode(fn, entity)
      this[name + 'Dev'] = this.callWithMode(fn, entity, 'development')
      this[name + 'Prod'] = this.callWithMode(fn, entity, 'production')
    })

    return this
  }

  set(key: string, value: *) {
    set(this.webpackOptions, key, value)
    return this
  }

  setOutput(output: string) {
    this.output = output
    return this
  }

  setContext(context: string) {
    this.context = path.isAbsolute(context) ? context : path.resolve(context)
    return this.guessEntry()
  }

  guessContext() {
    const context = ['src', 'lib', '.']
          .map(dir => path.resolve(dir))
          .find(dir => fs.existsSync(dir))

    if(!context) return this
    return this.setContext(context)
  }

  guessEntry() {
    if(!isEmpty(this.entry.value)) return this

    const entry = ['boot.js', 'index.js']
          .map(file => this.context
               ? path.resolve(this.context, file)
               : path.resolve(file))
          .find(file => fs.existsSync(file))

    if(!entry) return this
    return this.setEntryEntry(entry)
  }

  transform(): WebpackOptions {
    this.set('mode', this.webpackOptions.mode || this.guessMode())

    this.context && this.set('context', this.context)
    this.output && this.set('output.path', this.output)

    const transformEntry = this.entry.transform()
    !isEmpty(transformEntry) && this.set('entry', transformEntry)

    const transformPlugin = this.plugin.transform()
    !isEmpty(transformPlugin) && this.set('plugins', transformPlugin)

    const transformRule = this.rule.transform()
    !isEmpty(transformRule) && this.set('module.rules', transformRule)

    return this.webpackOptions
  }
}

function builder(...args): Builder {
  return new Builder(...args)
}


/// export

export default builder


/// test

import assert from 'assert'
import sinon from 'sinon'

describe('Class Builder', () => {
  it('Builder.constructor', () => {
    assert(new Builder())
    assert(new Builder().transform)
  })

  it('Builder.setMode', () => {
    assert.deepStrictEqual(
      'development',
      new Builder()
        .setMode('development')
        .mode
    )
  })

  it('Builder.resetMode', () => {
    assert.deepStrictEqual(
      undefined,
      new Builder()
        .setMode('development')
        .resetMode()
        .mode
    )
  })

  it('Builder.callWithMode', () => {
    const fake = sinon.fake()
    new Builder()
        .callWithMode(fake)()

    assert(1 === fake.callCount)
  })

  it('Builder.callWithMode', () => {
    const fake = sinon.fake()
    new Builder()
      .setMode('development')
      .callWithMode(fake, undefined, 'development')()

    assert(1 === fake.callCount)
  })

  it('Builder.callWithMode not match Builder.mode', () => {
    const builder = new Builder()
    assert.deepStrictEqual(
      builder,

      builder
        .callWithMode(() => 42, 'production')()
    )
  })

  it('Builder.transform', () => {
    assert.deepStrictEqual(
      {
        mode: 'test'
      },

      new Builder(null, { disableGuess: true })
        .transform()
    )
  })

  it('Builder.set', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        foo: 42
      },

      new Builder(null, { disableGuess: true })
        .set('foo', 42)
        .transform()
    )
  })

  it('Builder.set nest path', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        foo: {
          bar: 42
        }
      },

      new Builder(null, { disableGuess: true })
        .set('foo.bar', 42)
        .transform()
    )
  })

  it('Builder.setEntryEntry', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        entry: {
          main: ['foo']
        }
      },

      new Builder(null, { disableGuess: true })
        .setEntryEntry('foo')
        .transform()
    )
  })
})

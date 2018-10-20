/**
 * builder
 *
 * powerful webpack builder
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import { set, isEmpty, uniq } from 'lodash'
import modulePath from './module-resolver'
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
  debug?: boolean,
  logger?: Function,
  disableGuess?: boolean
}

const presetDir = path.resolve(__dirname, `./preset`)

class Builder {
  webpackOptions: string | WebpackOptions
  option: Option
  mode: ?WebpackMode
  context: ?string
  output: ?string
  entry: Entry
  plugin: Plugin
  rule: Rule
  presets: { [name: string]: string }
  jobs: Array<Function>

  constructor(webpackOptions: webpackOptions, options: Options) {
    this.options = options || {}
    this.webpackOptions = 'string' === typeof webpackOptions
      ? {}
      : (webpackOptions || {})
    this.mode = this.webpackOptions.mode || this.guessMode()
    this.entry = new Entry(this.webpackOptions.entry)
    this.plugin = new Plugin(this.webpackOptions.plugin)
    this.rule = new Rule(this.webpackOptions.module && this.webpackOptions.module.rules)
    this.presets = []
    this.jobs = []

    if(!this.options.disableGuess) {
      this.guessContext()
    }

    this
      .export(this, [
        'setContext',
        'setOutput'
      ], 'unshift')
      .export(this, [
        'set'
      ])
      .export(this.entry, [
        'setEntry',
        'deleteEntry',
        'clearEntry',
        'setEntryEntry',
        'setEntryPrepends',
        'clearEntryPrepends',
        'addEntryPrepend',
        'deleteEntryPrepend',
        'setEntryCommonPrepends',
        'clearEntryCommonPrepends',
        'addEntryCommonPrepend',
        'deleteEntryCommonPrepend'
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

    /**
     * if "webpackOptions" was string, call preset install
     */
    if('string' === typeof webpackOptions) {
      this.install(webpackOptions)
    }
  }

  /**
   * install preset
   */
  install(input: string) {
    uniq(input.split(',')).forEach(preset => {
      if(this.presets[preset]) return

      /**
       * resolve script path, order by:
       *   1. webpack/builder/preset
       *   2. node_modules/preset
       */
      const name = modulePath(path.resolve(presetDir, preset))
            || modulePath(preset)
      if(!name) throw new Error(`Preset not found, "${preset}"`)

      const { default: call, install, dependencies } = require(name)
      this.presets[preset] = dependencies
      install && this.install(install)
      call(this)
    })

    return this
  }

  setMode(mode: WebpackMode) {
    this.mode = mode
    return this
  }

  resetMode() {
    this.mode = undefined
    return this
  }

  /**
   * guess which mode should be use
   *
   * @private
   */
  guessMode(): WebpackMode {
    return readEnv('NODE_ENV') || 'development'
  }

  /**
   * @private
   */
  callWithMode(proc: string, fn: Function, entity?: any, mode?: string): () => any {
    return (...args) => {
      if(mode && mode !== this.mode) return this
      // fn.apply(entity || this, args)
      this.jobs[proc](() => fn.apply(entity || this, args))
      return this
    }
  }

  /**
   * @private
   */
  export(entity: any, fns: Array<string>, proc = 'push') {
    fns.forEach(name => {
      const fn = entity[name]
      this[name] = this.callWithMode(proc, fn, entity)
      this[name + 'Dev'] = this.callWithMode(proc, fn, entity, 'development')
      this[name + 'Prod'] = this.callWithMode(proc, fn, entity, 'production')
    })

    return this
  }

  set(key: string, value: *) {
    return this._set(key, value)
  }

  _set(key: string, value: *) {
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

  /**
   * guessContext
   *
   * by default, webpack set context to 'process.cwd()'
   * this method will set context to 'src', 'lib' and current
   * dir(also cwd)
   *
   * @private
   */
  guessContext() {
    const context = ['src', 'lib', '.']
          .map(dir => path.resolve(dir))
          .find(dir => fs.existsSync(dir))

    if(!context) return this
    return this.setContext(context)
  }

  /**
   * guessEntry
   *
   * by default, webpack set entry to "${context}/src/index.js"
   * this method will set 'boot.js' first. you also override
   * entry with 'this.setEntry'
   *
   * @private
   */
  guessEntry() {
    if(!isEmpty(this.entry.value)) return this

    const entry = ['boot.js', 'index.js']
          .map(file => this.context
               ? path.resolve(this.context, file)
               : path.resolve(file))
          .find(file => fs.existsSync(file))

    if(!entry) return this
    return this.entry.setEntryEntry(entry)
  }

  transform(): WebpackOptions {
    this.jobs.forEach(fn => fn())

    this._set('mode', this.webpackOptions.mode || this.guessMode())
    this.context && this._set('context', this.context)
    this.output && this._set('output.path', this.output)

    const transformEntry = this.entry.transform()
    !isEmpty(transformEntry) && this._set('entry', transformEntry)

    const transformPlugin = this.plugin.transform()
    !isEmpty(transformPlugin) && this._set('plugins', transformPlugin)

    const transformRule = this.rule.transform()
    !isEmpty(transformRule) && this._set('module.rules', transformRule)

    console.log(this.webpackOptions)
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

  it('Builder.constructor set preset', () => {
    assert(new Builder('spa'))
  })

  it('Builder.constructor set multi presets', () => {
    assert(new Builder('spa-spa'))
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

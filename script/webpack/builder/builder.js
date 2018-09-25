/**
 * builder
 *
 * @flow
 */

import { set, isFunction, camelCase, defaults } from 'lodash'
import Entry from './entry'
import Plugin from './plugin'
import readEnv from './read-env'
import type {
  WebpackOptions,
  Mode as WebpackMode,
  Entry as WebpackEntry
} from './webpack-options-type'


/// code

type Options = {
  webpackOptions?: webpackOptions
}

class Builder {
  webpackOptions: WebpackOptions
  mode: ?WebpackMode
  entry: Entry

  constructor(webpackOptions: webpackOptions = {}) {
    this.webpackOptions = webpackOptions
    this.entry = new Entry(webpackOptions.entry)
    this.plugin = new Plugin(webpackOptions.plugin)

    this
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

  guessEntry(): WebpackEntry {

  }

  /**
   * @private
   */
  callWithMode(fn: Function, mode?: string): () => any {
    return () => {
      if(mode !== this.mode) {
        return void 0
      }

      return fn()
    }
  }

  /**
   * @private
   */
  export(entity: any, fns: Array<string>) {
    fns.forEach(name => {
      const fn = entity[name].bind(entity)

      this[name] = this.callWithMode(fn)
      this[name + 'Dev'] = this.callWithMode(fn, 'development')
      this[name + 'Prod'] = this.callWithMode(fn, 'production')
    })

    return this
  }

  set(key: string, value: *) {
    set(this.webpackOptions, key, value)
    return this
  }

  transform(): WebpackOptions {
    this.set('mode', this.webpackOptions.mode || this.guessMode())
    this.set('entry', this.entry.transform() || this.guessEntry())
    this.set('plugin', this.plugin.transform())

    return this.webpackOptions
  }
}

function builder(options): Builder {
  return new Builder(options)
}


/// export

export default builder


/// test

import assert from 'assert'

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
    assert.deepStrictEqual(
      42,
      new Builder()
        .callWithMode(() => 42)()
    )
  })

  it('Builder.callWithMode', () => {
    assert.deepStrictEqual(
      42,
      new Builder()
        .setMode('development')
        .callWithMode(() => 42, 'development')()
    )
  })

  it('Builder.callWithMode not match Builder.mode', () => {
    assert.deepStrictEqual(
      undefined,
      new Builder()
        .callWithMode(() => 42, 'production')()
    )
  })

  // it('Builder.transform', () => {
  //   console.log(new Builder({
  //       entry: 'foo'
  //     }).transform())
  //   assert.deepStrictEqual(
  //     {
  //       mode: 'test'
  //     },

  //     new Builder().transform()
  //   )
  // })
})

/**
 * builder
 *
 * @flow
 */

import { set, noop, isFunction, isPlainObject, camelCase, defaults } from 'lodash'
import Entry from './entry'
import type { WebpackOptions, Mode as WebpackMode } from './webpack-options-type'


/// code

type Options = {
  webpackOptions?: webpackOptions
}

class Builder {
  mode: WebpackMode

  constructor(webpackOptions: webpackOptions = {}) {
    this.webpackOptions = webpackOptions
    this.mode = webpackOptions.mode || Builder.readEnv('NODE_ENV') || 'development'
    this.entry = new Entry(webpackOptions.entry)

    this.transform = this.transform.bind(this)

    this.export(this.entry, [
      'setEntry',
      'deleteEntry',
      'clearEntry',
      'setEntryEntry',
      'setEntryPrepends',
      'clearEntryPrepends',
      'addEntryPrepend',
      'deleteEntryPrepend'
    ])
  }

  static readEnv(name: string): ?string {
    if(!process.env) return null

    return process.env[name]
  }

  callWithMode(mode: string, fn: Function): Function {
    if(mode !== this.mode) {
      return noop
    }

    return fn
  }

  export(entity: any, fns: Array<string>) {
    fns.forEach(name => {
      const fn = entity[name].bind(entity)

      this[name] = fn
      this[name + 'Dev'] = this.callWithMode('development', fn)
      this[name + 'Prod'] = this.callWithMode('production', fn)
    })

    return this
  }

  transform(): WebpackOptions {
    set(this.webpackOptions, 'mode', this.mode)
    set(this.webpackOptions, 'entry', this.entry.transform())

    if(!this.webpackOptions.mode ||
       !Object.keys(this.webpackOptions.entry).length) {
      throw new Error(
        `The webpack options "mode" and "entry" was required`
      )
    }

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

  it('Builder#readEnv', () => {
    process.env.FOO = 'foo'

    assert.deepStrictEqual(
      'foo',
      Builder.readEnv('FOO')
    )
  })

  it('Builder.callWithMode', () => {
    const ref = () => {}

    assert.deepStrictEqual(
      ref,
      new Builder({ mode: 'development' }).callWithMode('development', ref)
    )
  })

  it('Builder.callWithMode not match Builder.mode', () => {
    const ref = () => {}

    assert.deepStrictEqual(
      noop,
      new Builder().callWithMode('production', ref)
    )
  })

  it('Builder.transform', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        entry: {
          main: ['foo']
        }
      },

      new Builder({
        entry: 'foo'
      }).transform()
    )
  })
})

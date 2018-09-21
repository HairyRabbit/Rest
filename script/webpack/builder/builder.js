/**
 * builder
 *
 * @flow
 */

import { set, isFunction, isPlainObject, camelCase, defaults } from 'lodash'
import Entry from './entry'
import type { WebpackOptions } from './webpack-options-type'


/// code

type Options = {
  webpackOptions?: webpackOptions
}

class Builder {
  constructor(webpackOptions: webpackOptions = {}) {

    this.webpackOptions = webpackOptions

    this.entry = new Entry(webpackOptions.entry)


    this.transform = this.transform.bind(this)

    [
      'setEntry',
      'deleteEntry',
      'clearEntry',
      'setEntryEntry',
      'setEntryPrepends',
      'clearEntryPrepends',
      'addEntryPrepend',
      'deleteEntryPrepend'
    ].forEach(name => {
      this[name] = this.entry[name].bind(this.entry)
      this[name + 'Dev'] = this.entry[name].bind(this.entry)
      this[name + 'Prod'] = this.entry[name].bind(this.entry)
    })
  }

  _export() {

  }

  transform(): WebpackOptions {
    set(this.webpackOptions, 'entry', this.entry.transform())

    return this.webpackOptions
  }
}

function builder(options) {
  return new Builder(options)
}


/// export

export default builder


/// test

import assert from 'assert'

describe('Class Builder', () => {
  it('Builder.constructor', () => {
    assert.deepStrictEqual(
      {
        entry: {
          main: ['foo']
        }
      },

      new Builder({
        entry: 'foo'
      }).transform()
    )
  })

  it('Builder.transform', () => {
    assert.deepStrictEqual(
      {
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

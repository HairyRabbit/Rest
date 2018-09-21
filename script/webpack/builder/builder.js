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
    this.setEntry = this.entry.setEntry.bind(this.entry)
    this.clearEntry = this.entry.clearEntry.bind(this.entry)
    this.deleteEntry = this.entry.deleteEntry.bind(this.entry)
    this.setEntryEntry = this.entry.setEntryEntry.bind(this.entry)
    this.setEntryPrepends = this.entry.setEntryPrepends.bind(this.entry)
    this.clearEntryPrepends = this.entry.clearEntryPrepends.bind(this.entry)
    this.addEntryPrepend = this.entry.addEntryPrepend.bind(this.entry)
    this.deleteEntryPrepend = this.entry.deleteEntryPrepend.bind(this.entry)
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

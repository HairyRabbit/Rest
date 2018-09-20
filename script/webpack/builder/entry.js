/**
 * entry tools
 *
 * @flow
 */

import type { Entry as WebpackEntry } from './webpack-option-type'

/// code

class Entry {
  constructor() {
    this.value = new Map()
  }

  setEntry(name: string, entry?: string | Function, prepends?: Array<string>) {
    this.value.set(name, {
      entry,
      prepends
    })

    return this
  }

  deleteEntry(name: string) {
    this.value.delete(name)
    return this
  }

  clearEntry(name: string) {
    this.value.clear()
    return this
  }

  setEntryEntry(name: string, entry: string | Function) {
    this.value.get(name).entry = entry
    return this
  }

  setEntryPrepends(name: string, prepends: Array<string> = []) {
    this.value.get(name).prepends = new Set(prepends)
    return this
  }

  clearEntryPrepends(name: string) {
    this.value.get(name).prepends.clear()
    return this
  }

  addEntryPrepend(name: string, prepend: string) {
    this.value.get(name).prepends.add(prepend)
    return this
  }

  deleteEnttyPrepend(name: string, prepend: string) {
    this.value.get(name).prepends.delete(prepend)
    return this
  }

  transform(): WebpackEntry {
    const options = {}

    this.value.forEach(({ entry, prepends }, name) => {
      switch(typeof entry) {
        case 'string': {
          options[name] = prepends ? [...Array.from(prepends), entry] : entry
          return
        }

        case 'function': {
          options[name] = entry(prepends)
          return
        }

        default: {
          return
        }
      }
    })

    return options
  }
}


/// export

export default Entry


/// test

import assert from 'assert'

describe('Class Entry', () => {
  it('Entry.setEntry', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: undefined,
        prepends: undefined
      }]]),

      new Entry().setEntry('foo').value
    )
  })
})

/**
 * entry tool, used for single entry, multi also supports.
 * the webpack entry schame:
 *
 * - function
 * - Object<{ [key: string]: non-empty string | Array<non-empty string> }>
 * - non-empty string
 * - Array<non-empty string>
 *
 * if entry was dynamic entry - function type, log warning
 * when set entry prepends, but commonPrepends was ok.
 *
 * @flow
 */

import { isEmpty } from 'lodash'
import parse from './entry-parser'
import type { Entry as WebpackEntry } from './webpack-options-type'


/// code

type EntryValue = string

type Value = {
  entry: ?EntryValue,
  prepends: Set<string>
}

class Entry {
  value: Map<string, Value>
  commons: Set<string>
  isDynamicEntry: boolean

  constructor(entry?: WebpackEntry) {
    this.value = new Map()
    this.commons = new Set()
    this.isDynamicEntry = false

    if(entry) {
      const [isDynamicEntry, parsed] = parse(entry)
      this.isDynamicEntry = isDynamicEntry

      if(!isDynamicEntry) {
        for(let i = 0; i < parsed.length; i++) {
          const { name, entry, prepends } = parsed[i]
          this.setEntry(name, entry, prepends)
        }
      }
    }
  }

  ensure(name: string) {
    if(name && !this.value.get(name)) this.setEntry(name)
    const value = this.value.get(name)
    if(!value) throw new Error(`Entry "${name}" not found`)
    return value
  }

  setEntry(name: string = 'main', entry: ?EntryValue, prepends?: Array<string> = []) {
    if(!Array.isArray(prepends)) {
      throw new Error(
        `Entry.setEntry prepends should be array`
      )
    }

    this.value.set(name, {
      entry,
      prepends: new Set(prepends)
    })

    return this
  }

  deleteEntry(name?: string = 'main') {
    this.value.delete(name)
    return this
  }

  clearEntry() {
    this.value.clear()
    return this
  }

  setEntryEntry(entry: ?EntryValue, name?: string = 'main') {
    this.ensure(name).entry = entry
    return this
  }

  setEntryPrepends(prepends?: Array<string> = [], name?: string = 'main') {
    if(!Array.isArray(prepends)) {
      throw new Error(
        `Entry.setEntry prepends argument should be array`
      )
    }

    if(!prepends.length) return this

    this.ensure(name).prepends = new Set(prepends)
    return this
  }

  clearEntryPrepends(name?: string = 'main') {
    this.ensure(name).prepends.clear()
    return this
  }

  addEntryPrepend(prepend: string, name?: string = 'main') {
    this.ensure(name).prepends.add(prepend)
    return this
  }

  deleteEntryPrepend(prepend: string, name?: string = 'main') {
    this.ensure(name).prepends.delete(prepend)
    return this
  }

  setEntryCommonPrepends(prepends: Array<string> = []) {
    if(!Array.isArray(prepends)) {
      throw new Error(
        `Entry.setEntry prepends argument should be array`
      )
    }

    this.commons = new Set(prepends)
    return this
  }

  clearEntryCommonPrepends() {
    this.commons.clear()
    return this
  }

  addEntryCommonPrepend(prepend: string) {
    this.commons.add(prepend)
    return this
  }

  deleteEntryCommonPrepend(prepend: string) {
    this.commons.delete(prepend)
    return this
  }

  transform(): WebpackEntry {
    const options = {}
    const commons = Array.from(this.commons)

    this.value.forEach(({ entry, prepends }, name) => {
      if(!entry) return

      const pre = [...commons, ...Array.from(prepends)]

      switch(typeof entry) {
        case 'string': {
          options[name] = [...pre, entry]
          return
        }

        default: {
          return
        }
      }
    })

    if(isEmpty(options)) throw new Error(
      `Entry was empty`
    )

    return options
  }
}


/// export

export default Entry


/// test

import assert from 'assert'

describe('Class Entry', () => {
  it('Entry.constrctor', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: 'bar',
        prepends: new Set()
      }],['baz', {
        entry: 'quxx',
        prepends: new Set(['qux'])
      }]]),

      new Entry({ foo: 'bar', baz: ['qux', 'quxx'] }).value
    )
  })

  it('Entry.setEntry', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: undefined,
        prepends: new Set()
      }]]),

      new Entry().setEntry('foo').value
    )
  })

  it('Entry.ensure', () => {
    assert.deepStrictEqual(
      { entry: undefined, prepends: new Set() },
      new Entry().ensure('foo')
    )
  })

  it('Entry.clearEntry', () => {
    assert.deepStrictEqual(
      new Map(),

      new Entry('foo').clearEntry().value
    )
  })

  it('Entry.clearEntry', () => {
    assert.deepStrictEqual(
      new Map(),

      new Entry('foo').clearEntry().value
    )
  })

  it('Entry.clearEntry with empty map', () => {
    assert.deepStrictEqual(
      new Map(),

      new Entry().clearEntry().value
    )
  })

  it('Entry.deleteEntry', () => {
    assert.deepStrictEqual(
      new Map(),

      new Entry('foo').deleteEntry('main').value
    )
  })

  it('Entry.deleteEntry name not exists', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'foo',
        prepends: new Set()
      }]]),

      new Entry('foo').deleteEntry('bar').value
    )
  })

  it('Entry.setEntryEntry', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Entry('foo').setEntryEntry('bar').value
    )
  })

  it('Entry.setEntryEntry with null', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: null,
        prepends: new Set()
      }]]),

      new Entry().setEntryEntry(null).value
    )
  })

  it('Entry.setEntryEntry with name', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'foo',
        prepends: new Set()
      }],['baz', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Entry('foo').setEntryEntry('bar', 'baz').value
    )
  })

  it('Entry.setEntryPrepends', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set(['foo'])
      }]]),

      new Entry().setEntryPrepends(['foo']).value
    )
  })

  it('Entry.setEntryPrepends with name', () => {
    assert.deepStrictEqual(
      new Map([['foo', {
        entry: undefined,
        prepends: new Set(['foo'])
      }]]),

      new Entry().setEntryPrepends(['foo'], 'foo').value
    )
  })

  it('Entry.setEntryPrepends empty array', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set()
      }]]),

      new Entry().setEntryPrepends([]).value
    )
  })

  it('Entry.setEntryPrepends empty argument', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: undefined,
        prepends: new Set()
      }]]),

      new Entry().setEntryPrepends().value
    )
  })

  it('Entry.clearEntryPrepends', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Entry(['foo', 'bar']).clearEntryPrepends().value
    )
  })

  it('Entry.clearEntryPrepends with name', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set(['foo'])
      }], ['foo', {
        entry: undefined,
        prepends: new Set()
      }]]),

      new Entry(['foo', 'bar']).clearEntryPrepends('foo').value
    )
  })

  it('Entry.addEntryPrepend', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set(['foo', 'baz'])
      }]]),

      new Entry(['foo', 'bar']).addEntryPrepend('baz').value
    )
  })

  it('Entry.addEntryPrepend with name', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set(['foo'])
      }], ['qux', {
        entry: undefined,
        prepends: new Set(['baz'])
      }]]),

      new Entry(['foo', 'bar']).addEntryPrepend('baz', 'qux').value
    )
  })

  it('Entry.deleteEntryPrepend', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Entry(['foo', 'bar']).deleteEntryPrepend('foo').value
    )
  })

  it('Entry.deleteEntryPrepend with name', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'bar',
        prepends: new Set(['foo'])
      }], ['baz', {
        entry: undefined,
        prepends: new Set()
      }]]),

      new Entry(['foo', 'bar']).deleteEntryPrepend('foo', 'baz').value
    )
  })

  it('Entry.setEntryCommonPrepends', () => {
    assert.deepStrictEqual(
      new Set(['foo', 'bar']),

      new Entry()
        .setEntryCommonPrepends(['foo', 'bar'])
        .commons
    )
  })

  it('Entry.clearEntryCommonPrepends', () => {
    assert.deepStrictEqual(
      new Set(),

      new Entry()
        .setEntryCommonPrepends(['foo', 'bar'])
        .clearEntryCommonPrepends()
        .commons
    )
  })

  it('Entry.addEntryCommonPrepends', () => {
    assert.deepStrictEqual(
      new Set(['foo', 'bar', 'baz']),

      new Entry()
        .setEntryCommonPrepends(['foo', 'bar'])
        .addEntryCommonPrepend('baz')
        .commons
    )
  })

  it('Entry.deleteEntryCommonPrepends', () => {
    assert.deepStrictEqual(
      new Set(['foo']),

      new Entry()
        .setEntryCommonPrepends(['foo', 'bar'])
        .deleteEntryCommonPrepend('bar')
        .commons
    )
  })

  it('Entry.transfrom', () => {
    assert.deepStrictEqual(
      {
        main: ['foo']
      },

      new Entry('foo').transform()
    )
  })

  it('Entry.transfrom filter null entry', () => {
    assert.deepStrictEqual(
      null,
      new Entry('foo').clearEntry().transform()
    )
  })

  it('Entry.transfrom with prepends', () => {
    assert.deepStrictEqual(
      { main: ['foo', 'bar'] },
      new Entry(['foo', 'bar']).transform()
    )
  })

  it('Entry.transform with common prepends', () => {
    assert.deepStrictEqual(
      { main: ['bar', 'foo'] },
      new Entry('foo').setEntryCommonPrepends(['bar']).transform()
    )
  })
})

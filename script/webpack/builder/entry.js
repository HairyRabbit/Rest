/**
 * entry tools
 *
 * @flow
 */

import { isEmpty } from 'lodash'
import parse from './entry-parser'
import type { Entry as WebpackEntry } from './webpack-options-type'


/// code

class Entry {
  constructor(entry?: WebpackEntry) {
    this.value = new Map()

    if(entry) {
      const parsed = parse(entry)

      for(let i = 0; i < parsed.length; i++) {
        const { name, entry, prepends } = parsed[i]
        this.setEntry(name, entry, prepends)
      }
    }
  }

  ensure(name?: string) {
    if(name && !this.value.get(name)) {
      this.setEntry(name)
    }

    return this
  }

  setEntry(name: string = 'main', entry?: string | Function, prepends?: Array<string> = []) {
    if(!Array.isArray(prepends)) {
      throw new Error(
        `Entry.setEntry prepends argument should be array`
      )
    }

    this.value.set(name, {
      entry,
      prepends: new Set(prepends)
    })

    return this
  }

  deleteEntry(name?: string) {
    this.ensure(name)
    this.value.delete(name)
    return this
  }

  clearEntry() {
    this.value.clear()
    return this
  }

  setEntryEntry(entry: string | Function, name?: string = 'main') {
    this.ensure(name)
    this.value.get(name).entry = entry
    return this
  }

  setEntryPrepends(prepends?: Array<string> = [], name?: string = 'main') {
    if(!Array.isArray(prepends)) {
      throw new Error(
        `Entry.setEntry prepends argument should be array`
      )
    }

    this.ensure(name)

    if(!prepends.length) return this

    this.value.get(name).prepends = new Set(prepends)
    return this
  }

  clearEntryPrepends(name?: string = 'main') {
    this.ensure(name)
    this.value.get(name).prepends.clear()
    return this
  }

  addEntryPrepend(prepend: string, name?: string = 'main') {
    this.ensure(name)
    this.value.get(name).prepends.add(prepend)
    return this
  }

  deleteEntryPrepend(prepend: string, name?: string = 'main') {
    this.ensure(name)
    this.value.get(name).prepends.delete(prepend)
    return this
  }

  transform(): ?WebpackEntry {
    const options = {}

    this.value.forEach(({ entry, prepends }, name) => {
      if(!entry) return

      const pre = Array.from(prepends)

      switch(typeof entry) {
        case 'string': {
          options[name] = [...pre, entry]
          return
        }

        case 'function': {
          options[name] = () => entry(pre)
          return
        }

        default: {
          return
        }
      }
    })

    if(isEmpty(options)) return null

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

      new Entry({
        foo: 'bar',
        baz: ['qux', 'quxx']
      }).value
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
      new Map([['foo', {
        entry: undefined,
        prepends: new Set()
      }]]),

      new Entry().ensure('foo').value
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
      {
        main: ['foo', 'bar']
      },

      new Entry(['foo', 'bar']).transform()
    )
  })

  it('Entry.transfrom with dyamic entry', () => {
    const ref = a => a
    assert.deepStrictEqual(
      ['foo'],

      new Entry(ref).setEntryPrepends(['foo']).transform().main()
    )
  })


})

/**
 * entry tool, first support SPA, MPA also works fine.
 * the webpack entry types:
 *
 * - function - DynamicEntry
 * - Object<{ [key: string]: string | Array<string> }> - MultiEntry
 * - string - SingleEntry
 * - Array<string> - MultiEntry
 *
 * @link [webpack/lib/EntryOptionPlugin](https://github.com/webpack/webpack/blob/master/lib/EntryOptionPlugin.js)
 * @flow
 */

import { isEmpty } from 'lodash'
import parse from './entry-parser'
import { Builder } from './builder'
import type { Entry as WebpackEntry } from './webpack-options-type'


/// code

type Entry$Value = {
  entry: ?string,
  prepends: Set<string>
}

class Entry {
  value: Map<string, Entry$Value>
  commons: Set<string>
  dynamicEntry: ?Function

  constructor(entry?: WebpackEntry) {
    this.value = new Map()
    this.commons = new Set()

    if(entry) {
      const parsed = parse(entry)
      if('function' === typeof parsed) {
        this.dynamicEntry = parsed
      } else {
        for(let i = 0; i < parsed.length; i++) {
          const { name, entry, prepends } = parsed[i]
          this.setEntry(entry, prepends, name)
        }
      }
    }
  }

  /**
   * test value is empty
   *
   * @private
   */
  isEmpty() {
    return 0 === this.value.size
  }

  /**
   * ensure the named entry avaiable
   *
   * @private
   */
  ensure(name: string) {
    if(name && !this.getEntry(name)) this.setEntry(undefined, undefined, name)
    const value = this.value.get(name)
    if(!value) throw new Error(`Entry "${name}" not found`)
    return value
  }

  /**
   * get entry by name
   *
   * @private
   */
  getEntry(name?: string = 'main') {
    return this.value.get(name)
  }

  setEntry(entry: ?string, prepends?: Array<string> = [], name?: string = 'main') {
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

  /**
   * set entry module path
   */
  setEntryModule(entry: ?string, name?: string = 'main') {
    this.ensure(name).entry = entry
    return this
  }

  /**
   * rename entry name to a new one
   */
  renameEntry(name?: string = 'main', newName: string) {
    if(!newName) {
      throw new Error('name was required')
    }

    this.value.set(newName, this.ensure(name))
    this.deleteEntry(name)
    return this
  }

  setEntryPrepends(prepends?: Array<string> = [], name?: string = 'main') {
    if(!Array.isArray(prepends)) {
      throw new Error(
        `Entry.setEntry prepends argument should be array`
      )
    }

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

  /**
   * setEntryCommonPrepends, override entry commons prepends
   */
  setEntryCommonPrepends(prepends: Array<string> = []) {
    if(!Array.isArray(prepends)) {
      throw new Error(
        `Entry.setEntry prepends argument should be array`
      )
    }

    this.commons = new Set(prepends)
    return this
  }

  /**
   * clearEntryCommonPrepends, clear commons prepends
   */
  clearEntryCommonPrepends() {
    this.commons.clear()
    return this
  }

  /**
   * addEntryCommonPrepend, add commons prepend
   */
  addEntryCommonPrepend(prepend: string) {
    this.commons.add(prepend)
    return this
  }

  /**
   * deleteEntryCommonPrepend, delete commons prepend
   */
  deleteEntryCommonPrepend(prepend: string) {
    this.commons.delete(prepend)
    return this
  }

  /**
   * transform to webpack option.entry
   */
  transform(): WebpackEntry {
    const options = {}
    const commons = Array.from(this.commons)

    this.value.forEach(({ entry, prepends }, name) => {
      if('string' !== typeof entry) return
      options[name] = [
        ...commons,
        ...Array.from(prepends),
        entry
      ]
    })

    const dynamicEntry = this.dynamicEntry
    if(dynamicEntry) {
      return function wrapperDynamicEntry() {
        return dynamicEntry(options, commons)
      }
    }

    return options
  }

  static init(self: Builder): Builder {
    self.entry = new Entry(self.webpackOptions.entry)
    return self.export(self.entry, [
      'setEntry',
      'deleteEntry',
      'clearEntry',
      'renameEntry',
      'setEntryModule',
      'setEntryPrepends',
      'clearEntryPrepends',
      'addEntryPrepend',
      'deleteEntryPrepend',
      'setEntryCommonPrepends',
      'clearEntryCommonPrepends',
      'addEntryCommonPrepend',
      'deleteEntryCommonPrepend'
    ])
  }

  static setOption(self: Builder): Builder {
    const options = self.entry.transform()
    if(isEmpty(options)) return self
    return self._set('entry', options)
  }
}


/// export

export default Entry


/// test

import webpack from 'webpack'
import assert from 'assert'

describe('Class Entry', () => {
  const init = { entry: undefined, prepends: new Set() }
  it('Entry.constrctor', () => {
    const entry = new Entry()
    assert.deepStrictEqual(new Map(), entry.value)
    assert.deepStrictEqual(new Set(), entry.commons)
    assert.deepStrictEqual(undefined, entry.dynamicEntry)
  })

  it('Entry.constrctor, should parse webpack entry options', () => {
    assert.deepStrictEqual(
      new Map([['foo', { entry: 'bar', prepends: new Set() }],
               ['baz', { entry: 'quxx', prepends: new Set(['qux']) }]]),
      new Entry({ foo: 'bar', baz: ['qux', 'quxx'] }).value
    )
  })

  it('Entry.constrctor, should parse webpack dynamic entry', () => {
    const ref = () => 'foo'
    const entry = new Entry(ref)
    assert.deepStrictEqual(new Map(), entry.value)
    assert.deepStrictEqual(ref, entry.dynamicEntry)
  })

  it('Entry.isEmpty', () => {
    assert(new Entry().isEmpty())
    assert(!new Entry('foo').isEmpty())
  })

  it('Entry.getEntry', () => {
    const entry = new Entry().setEntry()
    assert.deepStrictEqual(init, entry.getEntry())
  })

  it('Entry.getEntry, undefined', () => {
    const entry = new Entry().setEntry()
    assert.deepStrictEqual(undefined, entry.getEntry('foo'))
  })

  it('Entry.ensure', () => {
    assert.deepStrictEqual(init, new Entry().ensure('foo'))
  })

  it('Entry.renameEntry', () => {
    const entry = new Entry().setEntry()
    entry.renameEntry('main', 'foo')
    assert.deepStrictEqual(undefined, entry.getEntry())
    assert.deepStrictEqual(init, entry.getEntry('foo'))
  })

  it('Entry.setEntry, default entry', () => {
    assert.deepStrictEqual(init, new Entry().setEntry().getEntry())
  })

  it('Entry.setEntry, with name', () => {
    const entry = new Entry().setEntry(undefined, undefined, 'foo')
    assert.deepStrictEqual(init, entry.getEntry('foo'))
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
      new Map([['main', { entry: 'foo', prepends: new Set() }]]),
      new Entry('foo').deleteEntry('bar').value
    )
  })

  it('Entry.setEntryModule', () => {
    assert.deepStrictEqual(
      new Map([['main', { entry: 'bar', prepends: new Set() }]]),
      new Entry('foo').setEntryModule('bar').value
    )
  })

  it('Entry.setEntryModule with null', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: null,
        prepends: new Set()
      }]]),

      new Entry().setEntryModule(null).value
    )
  })

  it('Entry.setEntryModule with name', () => {
    assert.deepStrictEqual(
      new Map([['main', {
        entry: 'foo',
        prepends: new Set()
      }],['baz', {
        entry: 'bar',
        prepends: new Set()
      }]]),

      new Entry('foo').setEntryModule('bar', 'baz').value
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
      { main: ['foo'] },
      new Entry('foo').transform()
    )
  })

  it('Entry.transfrom for dynamic entry', () => {
    const ref = () => 'foo'
    const opt = new Entry(ref).transform()
    assert('function' === typeof opt)
  })

  it('Entry.transfrom for dynamic entry and pass commons and options', () => {
    const ref = (...args) => args
    const opt = new Entry(ref)
          .addEntryCommonPrepend('foo')
          .setEntry('bar')
          .transform()
    if('function' !== typeof opt) return false
    assert.deepStrictEqual([{ main: ['foo', 'bar'] }, ['foo']], opt())
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

/**
 * entry transform
 */

import * as fs from 'fs'
import * as path from 'path'
import * as webpack from 'webpack'
import { isUndefined } from 'lodash'
import { webpackOptionSetter, ITransform } from '../builder'

type EntryName = string
type EntryPrepends = Array<string>

type EntryValue = {
  module: string | undefined,
  prepends: Set<string>
}

export interface Options {
  readonly guessEntry?: boolean
}

export default class Entry implements ITransform {
  public readonly name: string = 'entry'
  public readonly exports: Array<string> = [
    'setEntry',
    'deleteEntry',
    'setEntries',
    'clearEntries',
    'setEntryModule',
    'clearEntryModule',
    'addEntryPrepend',
    'deleteEntryPrepend',
    'addEntryPrepends',
    'clearEntryPrepends',
    'addEntryCommonPrepend',
    'deleteEntryCommonPrepend',
    'addEntryCommonPrepends',
    'clearEntryCommonPrepends'
  ]
  private readonly context: string
  private value: Map<EntryName, EntryValue>
  private commons: Set<string>
  private readonly guessEntry: boolean

  constructor(builder, { guessEntry = true }: Options = {}) {
    this.context = builder.context
    this.guessEntry = guessEntry
    this.value = new Map()
    this.commons = new Set()
    this.init()
  }

  private init(): this {
    if(!this.guessEntry) return this

    const guess: string = ['src', 'lib'].find(dir => {
      const dirpath: string = path.resolve(this.context, dir)
      return fs.existsSync(dirpath)
    }) || ''

    return this.setEntry('main', `./${guess}`)
  }

  private ensureEntry(entry: EntryName, module?: string, prepends?: EntryPrepends): EntryValue {
    const value = this.value.get(entry)
    if(isUndefined(value)) {
      return this.initEntry(entry, module, prepends)
    }

    return value
  }

  private initEntry(entry: EntryName, module?: string, prepends?: EntryPrepends): EntryValue {
    const value = { module: module, prepends: new Set(prepends) }
    this.value.set(entry, value)
    return value
  }

  public setEntry(entry: EntryName, module?: string, prepends?: EntryPrepends): this {
    this.ensureEntry(entry, module, prepends)
    return this
  }

  public deleteEntry(entry: EntryName): this {
    this.value.delete(entry)
    return this
  }

  public setEntries(entries: Array<{ entry: EntryName, module?: string, prepends?: EntryPrepends }>): this {
    entries.forEach(this.setEntry.bind(this))
    return this
  }

  public clearEntries(entry: EntryName): this {
    this.value.clear()
    return this
  }

  public setEntryModule(entry: EntryName, module: string): this {
    this.ensureEntry(entry).module = module
    return this
  }

  public clearEntryModule(entry: EntryName): this {
    this.ensureEntry(entry).module = undefined
    return this
  }

  public addEntryPrepend(entry: EntryName, prepend: string): this {
    this.ensureEntry(entry).prepends.add(prepend)
    return this
  }

  public deleteEntryPrepend(entry: EntryName, prepend: string): this {
    this.ensureEntry(entry).prepends.delete(prepend)
    return this
  }

  public addEntryPrepends(entry: EntryName, prepends: Array<string>): this {
    prepends.forEach(this.addEntryPrepend.bind(this))
    return this
  }

  public clearEntryPrepend(entry: EntryName): this {
    this.ensureEntry(entry).prepends.clear()
    return this
  }

  public addEntryCommonPrepend(common: string): this {
    this.commons.add(common)
    return this
  }

  public deleteEntryCommonPrepend(common: string): this {
    this.commons.delete(common)
    return this
  }

  public addEntryCommonPrepends(commons: Array<string>): this {
    commons.forEach(this.addEntryCommonPrepend.bind(this))
    return this
  }

  public clearEntryCommonPrepends(): this {
    this.commons.clear()
    return this
  }

  public transform(setWebpackOptions: webpackOptionSetter): void {
    const entry: webpack.Configuration['entry'] = {}

    this.value.forEach(({ module, prepends }, name) => {
      if('string' !== typeof module) return
      entry[name] = [
        ...Array.from(this.commons),
        ...Array.from(prepends),
        module
      ]
    })

    setWebpackOptions('entry', entry)
  }
}

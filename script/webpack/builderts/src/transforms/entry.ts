/**
 * entry transform
 */

import * as fs from 'fs'
import * as path from 'path'
import * as webpack from 'webpack'
import { isUndefined, isArray, isFunction } from 'lodash'
import { webpackOptionSetter, ITransform, Builder } from '../builder'

type EntryName = string
type EntryPrepends = Array<string>

interface EntryValue {
  name?: string
  module?: string
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
    'setEntryName',
    'clearEntryName',
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

  constructor(builder: Builder, { guessEntry = true }: Options = {}) {
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

  private ensureEntry(entry: EntryName,
                      module?: string,
                      prepends?: Array<string>,
                      name?: string): EntryValue {
    const value = this.value.get(entry)
    if(!isUndefined(value)) return value
    return this.initEntry(entry, module, prepends, name)
  }

  private initEntry(entry: EntryName,
                    module?: string,
                    prepends?: Array<string>,
                    name?: string): EntryValue {
    const value = { name, module, prepends: new Set(prepends || []) }
    this.value.set(entry, value)
    return value
  }

  public setEntry(entry: EntryName,
                  module?: string,
                  prepends?: Array<string>,
                  name?: string): this {
    if(module) this.setEntryModule(entry, module)
    if(isArray(prepends) && prepends.length > 0) this.setEntryPrepends(entry, prepends)
    if(name) this.setEntryName(entry, name)
    return this
  }

  public deleteEntry(entry: EntryName): this {
    this.value.delete(entry)
    return this
  }

  public setEntries(entries: Array<{ entry: EntryName, module?: string, prepends?: EntryPrepends, name?: string }>): this {
    entries.forEach(
      ({ entry, module, prepends, name }) => this.setEntry(entry, module, prepends, name)
    )
    return this
  }

  public clearEntries(): this {
    this.value.clear()
    return this
  }

  public setEntryName(entry: EntryName, name?: EntryValue['name']): this {
    this.ensureEntry(entry).name = name
    return this
  }

  public clearEntryName(entry: EntryName): this {
    this.ensureEntry(entry).name = undefined
    return this
  }

  public setEntryModule(entry: EntryName, module: string | Function): this {
    const _module = this.ensureEntry(entry).module
    this.ensureEntry(entry).module = isFunction(module)
      ? module(_module)
      : module
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

  public setEntryPrepends(entry: EntryName, prepends: Array<string>): this {
    prepends.forEach(prepend => this.addEntryPrepend(entry, prepend))
    return this
  }

  public clearEntryPrepends(entry: EntryName): this {
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

  public setEntryCommonPrepends(commons: Array<string>): this {
    commons.forEach(this.addEntryCommonPrepend.bind(this))
    return this
  }

  public clearEntryCommonPrepends(): this {
    this.commons.clear()
    return this
  }

  public transform(setWebpackOptions: webpackOptionSetter): void {
    const acc: webpack.Entry = Object.create(null)
    this.value.forEach(({ module, prepends, name }, entry) => {
      if('string' !== typeof module) return

      acc[name || entry] = [
        ...Array.from(this.commons),
        ...Array.from(prepends),
        module
      ]
    })

    setWebpackOptions('entry', acc)
  }
}

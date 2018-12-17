/**
 * plugin transform
 *
 * @todo impl plugin groups
 */

import * as webpack from 'webpack'
import { isUndefined } from 'lodash'
import { webpackOptionSetter, ITransform } from '../builder'

type PluginName = string
type PluginOption<O> = { [P in keyof O]: O[P] }
type PluginValue<C> = {
  constructor: C | undefined,
  options: Map<string, any>
}

export interface Options {}

export default class Plugin implements ITransform {
  public readonly name: string = 'plugin'
  public readonly exports: Array<string> = [
    'setPlugin',
    'deletePlugin',
    'setPlugins',
    'clearPlugins',
    'setPluginConstructor',
    'deletePluginConstructor',
    'setPluginOption',
    'deletePluginOption',
    'setPluginOptions',
    'clearPluginOptions'
  ]
  private value: Map<PluginName, PluginValue<any>>

  constructor() {
    this.value = new Map()
  }

  private ensurePlugin<C, O>(plugin: PluginName, constructor?: C, options?: PluginOption<O>): PluginValue<C> {
    const value = this.value.get(plugin)
    if(!isUndefined(value)) return value
    return this.initPlugin(plugin, constructor, options)
  }

  private initPlugin<C, O>(plugin: PluginName, constructor?: C, options?: PluginOption<O>): PluginValue<C> {
    const value = { constructor, options: new Map(Object.entries(options || {})) }
    this.value.set(plugin, value)
    return value
  }

  public setPlugin<C, O>(plugin: PluginName, constructor?: C, options?: PluginOption<O>): this {
    this.ensurePlugin(plugin, constructor, options)
    return this
  }

  public deletePlugin(plugin: PluginName): this {
    this.value.delete(plugin)
    return this
  }

  public setPlugins(plugins: Array<{ plugin: PluginName, constructor?: any, options?: PluginOption<any> }>): this {
    plugins.forEach(this.setPlugin.bind(this))
    return this
  }

  public clearPlugins(): this {
    this.value.clear()
    return this
  }

  public setPluginConstructor<C>(plugin: PluginName, constructor: C): this {
    this.ensurePlugin(plugin).constructor = constructor
    return this
  }

  public deletePluginConstructor(plugin: PluginName): this {
    this.ensurePlugin(plugin).constructor = undefined
    return this
  }

  public setPluginOption<V>(plugin: PluginName, key: string, value: V): this {
    this.ensurePlugin(plugin).options.set(key, value)
    return this
  }

  public deletePluginOption(plugin: PluginName, key: string): this {
    this.ensurePlugin(plugin).options.delete(key)
    return this
  }

  public setPluginOptions(plugin: PluginName, options: PluginOption<any>): this {
    this.ensurePlugin(plugin).options = new Map(Object.entries(options || {}))
    return this
  }

  public clearPluginOptions(plugin: PluginName): this {
    this.ensurePlugin(plugin).options.clear()
    return this
  }

  public transform(setWebpackOptions: webpackOptionSetter): void {
    const plugins: Array<webpack.Plugin> = []

    this.value.forEach(({ constructor, options }) => {
      if(isUndefined(constructor)) return

      const opt = {}
      options.forEach((value, key) => {
        opt[key] = value
      })
      plugins.push(new constructor(opt))
    })

    setWebpackOptions('plugins', plugins)
  }
}

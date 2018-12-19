/**
 * plugin transform
 *
 * @todo impl plugin groups
 */

import * as webpack from 'webpack'
import { isUndefined } from 'lodash'
import { webpackOptionSetter, ITransform } from '../builder'
import { isString } from 'util';
import { requireModule } from '../dep';

type UnionToIntersection<U> =
  (U extends any
    ? (k: U) => void
    : never
  ) extends ((k: infer I) => void) ? I : never

type ConvertToMapFromObject<O> = UnionToIntersection<{
  [K in keyof O]: Map<K, O[K]>
}[keyof O]>

type PluginName = string
type PluginOption<O> = { [P in keyof O]: O[P] }
type PluginValue = {
  constructor: string | { new(...a: any[]): any } | undefined,
  // options: ConvertToMapFromObject<PluginOption<O>> | {}
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

  private value: any

  constructor() {
    this.value = new Map()
  }

  private ensurePlugin(plugin: PluginName,
                       constructor?: PluginValue['constructor'],
                       options?: PluginValue['options']): PluginValue {
    const value = this.value.get(plugin)
    if(!isUndefined(value)) return value
    return this.initPlugin(plugin, constructor, options)
  }

  private initPlugin(plugin: PluginName,
                     constructor?: PluginValue['constructor'],
                     options?: PluginValue['options']): PluginValue {
    const value = ({
      constructor,
      options: new Map(Object.entries(options || {})) as ConvertToMapFromObject<PluginOption<Map<string, {}>>>
    })
    this.value.set(plugin, value)
    return value
  }

  public setPlugin(plugin: PluginName,
                   constructor?: PluginValue['constructor'],
                   options?: PluginValue['options']): this {
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

  public setPluginConstructor(plugin: PluginName, constructor: PluginValue['constructor']): this {
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

  public setPluginOptions<Options>(plugin: PluginName, options: PluginOption<Options>): this {
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
      if(isString(constructor)) constructor = requireModule(constructor)

      const opt = {}
      options.forEach((value, key) => {
        opt[key] = value
      })
      plugins.push(new constructor(opt))
    })

    setWebpackOptions('plugins', plugins)
  }
}

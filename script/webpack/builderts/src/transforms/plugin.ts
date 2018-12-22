/**
 * plugin transform
 *
 * @todo impl plugin groups
 * @todo impl plugin args when constructor not one argument
 */

import * as webpack from 'webpack'
import { isUndefined } from 'lodash'
import { webpackOptionSetter, ITransform } from '../builder'
import { isString } from 'util';
import { requireModule } from '../dep'

type Constructor = string | { new(...a: any[]): any }

interface Value {
  ctor?: Constructor
  args?: Array<any>
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

  private value: Map<string, Value>

  constructor() {
    this.value = new Map()
  }

  private ensurePlugin(plugin: string,
                       ctor?: Constructor,
                       options?: object): Value {
    const value = this.value.get(plugin)
    if(!isUndefined(value)) return value
    return this.initPlugin(plugin, ctor, options)
  }

  private initPlugin(plugin: string,
                     ctor?: Constructor,
                     options?: object): Value {
    const value: Value = {
      ctor,
      options: new Map(Object.entries(options || Object.create(null)))
    }
    this.value.set(plugin, value)
    return value
  }

  public setPlugin(plugin: string,
                   constructor?: Constructor,
                   options?: object): this {
    return this
      .setPluginConstructor(plugin, constructor)
      .setPluginOptions(plugin, options)
  }

  public deletePlugin(plugin: string): this {
    this.value.delete(plugin)
    return this
  }

  public setPlugins(plugins: Array<{ plugin: string } & Value>): this {
    plugins.forEach(
      ({ plugin, constructor, options }) => this.setPlugin(plugin,
                                                           constructor as Constructor,
                                                           options)
    )
    return this
  }

  public clearPlugins(): this {
    this.value.clear()
    return this
  }

  public setPluginConstructor(plugin: string, constructor?: Constructor): this {
    this.ensurePlugin(plugin).ctor = constructor
    return this
  }

  public deletePluginConstructor(plugin: string): this {
    return this.setPluginConstructor(plugin)
  }

  public setPluginOption<V>(plugin: string, key: string, value: V): this {
    this.ensurePlugin(plugin).options.set(key, value)
    return this
  }

  public deletePluginOption(plugin: string, key: string): this {
    this.ensurePlugin(plugin).options.delete(key)
    return this
  }

  public setPluginOptions<O>(plugin: string, options?: O): this {
    this.ensurePlugin(plugin).options = new Map(Object.entries(options || Object.create(null)))
    return this
  }

  public clearPluginOptions(plugin: string): this {
    this.ensurePlugin(plugin).options.clear()
    return this
  }

  public transform(setWebpackOptions: webpackOptionSetter): void {
    const plugins: Array<webpack.Plugin> = []

    this.value.forEach(({ ctor, options }) => {
      if(isUndefined(ctor)) return

      /**
       * require plugin first when type was `string`
       */
      const Ctor: { new(...a: any[]): any } = isString(ctor) ? requireModule(ctor) : ctor

      const opt: { [key: string]: any } = Object.create({})
      options.forEach((value, key) => {
        opt[key] = value
      })
      plugins.push(new Ctor(opt))
    })

    setWebpackOptions('plugins', plugins)
  }
}

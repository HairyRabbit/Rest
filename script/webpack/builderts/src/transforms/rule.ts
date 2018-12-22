/**
 * rule transform
 *
 * @todo impl extract-text loader
 */

import * as webpack from 'webpack'
import { isUndefined, isEmpty } from 'lodash'
import { webpackOptionSetter, ITransform } from '../builder'

type LoaderOption<O> = { [P in keyof O]: O[P] }
type Loader = {
  use?: any,
  options: Map<string, any>
}
type FileTypes = Array<string>
type Loaders = { [loader:string]: Loader }
type RuleOption<O> = { [P in keyof O]: O[P] }
type RuleValue = {
  filetypes: Set<string>,
  loaders: Map<string, Loader>,
  options: Map<string, any>
}

export interface Options {}

export default class Rule implements ITransform {
  public readonly name: string = 'rule'
  public readonly exports: Array<string> = [
    'setRule',
    'deleteRule',
    'setRules',
    'clearRules',
    'addRuleFileType',
    'deleteRuleFileType',
    'setRuleFileTypes',
    'deleteRuleFileTypes',
    'setRuleOption',
    'deleteRuleOption',
    'setRuleOptions',
    'clearRuleOptions',
    'setRuleLoader',
    'deleteRuleLoader',
    'setRuleLoaders',
    'clearRuleLoaders',
    'setRuleLoaderUse',
    'deleteRuleLoaderUse',
    'setRuleLoaderOption',
    'deleteRuleLoaderOption',
    'setRuleLoaderOptions',
    'clearRuleLoaderOptions'
  ]
  private value: Map<string, RuleValue>

  constructor() {
    this.value = new Map()
  }

  private ensureRule<O>(rule: string,
                        filetypes?: FileTypes,
                        loaders?: Loaders,
                        options?: RuleOption<O>): RuleValue {
    const value: RuleValue | undefined = this.value.get(rule)
    if(!isUndefined(value)) return value
    return this.initRule(rule, filetypes, loaders, options)
  }

  private initRule<O>(rule: string,
                      filetypes?: FileTypes,
                      loaders?: Loaders,
                      options?: RuleOption<O>): RuleValue {
    const value: RuleValue = {
      filetypes: new Set(filetypes),
      loaders: new Map(Object.entries(loaders || {})),
      options: new Map(Object.entries(options || {}))
    }
    this.value.set(rule, value)
    return value
  }

  public setRule<O>(rule: string,
                    filetypes?: FileTypes,
                    loaders?: Loaders,
                    options?: RuleOption<O>): this {
    this.ensureRule(rule, filetypes, loaders, options)
    return this
  }

  public deleteRule(rule: string): this {
    this.value.delete(rule)
    return this
  }

  public setRules(rules: Array<{ rule: string,
                                 filetypes?: FileTypes,
                                 loaders?: Loaders,
                                 options?: RuleOption<any> }>): this {
    rules.forEach(
      ({ rule, filetypes, loaders, options }) => this.setRule(rule,
                                                              filetypes,
                                                              loaders,
                                                              options)
    )
    return this
  }

  public clearRules(): this {
    this.value.clear()
    return this
  }

  public addRuleFileType(rule: string, type: string): this {
    this.ensureRule(rule).filetypes.add(type)
    return this
  }

  public deleteRuleFileType(rule: string, type: string): this {
    this.ensureRule(rule).filetypes.delete(type)
    return this
  }

  public setRuleFileTypes(rule: string, types: FileTypes): this {
    this.ensureRule(rule).filetypes = new Set(types)
    return this
  }

  public clearRuleFileTypes(rule: string): this {
    this.ensureRule(rule).filetypes.clear()
    return this
  }

  public setRuleOption<V>(rule: string, key: string, value: V): this {
    this.ensureRule(rule).options.set(key, value)
    return this
  }

  public deleteRuleOption(rule: string, key: string): this {
    this.ensureRule(rule).options.delete(key)
    return this
  }

  public setRuleOptions(rule: string, options: RuleOption<any>): this {
    this.ensureRule(rule).options = new Map(Object.entries(options || {}))
    return this
  }

  public clearRuleOptions(rule: string): this {
    this.ensureRule(rule).options = new Map()
    return this
  }

  private ensureRuleLoader<O>(rule: string,
                              string: string,
                              loader?: { use?: any, options?: LoaderOption<O> }): Loader {
    const _rule = this.ensureRule(rule)
    const value: Loader | undefined = _rule.loaders.get(string)
    if(!isUndefined(value)) return value
    return this.initRuleLoader(_rule, string, loader || {})
  }

  private initRuleLoader<O>(rule: RuleValue,
                            string: string,
                            { use, options }: { use?: any, options?: LoaderOption<O> }): Loader {
    const value: Loader = {
      use,
      options: new Map(Object.entries(options || {}))
    }
    rule.loaders.set(string, value)
    return value
  }

  public setRuleLoader(rule: string, string: string, loader?: Loader): this {
    this.ensureRuleLoader(rule, string, loader)
    return this
  }

  public deleteRuleLoader(rule: string, loader: string): this {
    this.ensureRule(rule).loaders.delete(loader)
    return this
  }

  public setRuleLoaders(rule: string, loaders: Loaders): this {
    Object.keys(loaders).forEach(loader => {
      this.setRuleLoader(rule, loader, loaders[loader])
    })
    return this
  }

  public clearRuleLoaders(rule: string): this {
    this.ensureRule(rule).loaders.clear()
    return this
  }

  public setRuleLoaderUse(rule: string, loader: string, use?: any): this {
    this.ensureRuleLoader(rule, loader).use = use
    return this
  }

  public deleteRuleLoaderUse(rule: string, loader: string): this {
    return this.setRuleLoaderUse(rule, loader)
  }

  public setRuleLoaderOption<V>(rule: string, loader: string, key: string, value: V): this {
    this.ensureRuleLoader(rule, loader).options.set(key, value)
    return this
  }

  public deleteRuleLoaderOption(rule: string, loader: string, key: string): this {
    this.ensureRuleLoader(rule, loader).options.delete(key)
    return this
  }

  public setRuleLoaderOptions(rule: string, loader: string, options: LoaderOption<any>): this {
    this.ensureRuleLoader(rule, loader).options = new Map(Object.entries(options))
    return this
  }

  public clearRuleLoaderOptions(rule: string, loader: string): this {
    this.ensureRuleLoader(rule, loader).options.clear()
    return this
  }

  public transform(setWebpackOptions: webpackOptionSetter): void {
    const rules: Array<webpack.RuleSetRule> = []

    this.value.forEach(({ filetypes, loaders, options }, rule) => {
      const uses: Array<{ loader: any, options: Object }> = []

      loaders.forEach(({ use, options: loaderOptions }, loader) => {
        const loaderOpts: { [key: string]: any } = Object.create(null)
        loaderOptions.forEach((optv, optk) => {
          loaderOpts[optk] = optv
        })

        uses.push({
          loader: !isUndefined(use) ? use : loader,
          options: loaderOpts
        })
      })

      const test: string = isEmpty(filetypes)
        ? rule
        : Array.from(filetypes).join('|')

      const opts: { [key: string]: string } = Object.create(null)
      options.forEach((optv, optk) => {
        opts[optk] = optv
      })

      rules.push({
        test: new RegExp(`\\.(${test})$`),
        use: uses,
        ...opts
      })
    })

    setWebpackOptions('module.rules', rules)
  }
}

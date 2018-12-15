/**
 * rule transform
 *
 * @todo impl extract-text loader
 */

import * as webpack from 'webpack'
import { isUndefined, isEmpty } from 'lodash'
import { webpackOptionSetter, ITransform } from '../builder'

type LoaderOption<O> = { [P in keyof O]: O[P] }
type LoaderName = string
type Loader = {
  use?: any,
  options: Map<string, any>
}
type FileTypes = Array<string>
type Loaders = { [loader:string]: Loader }
type RuleName = string
type RuleOption<O> = { [P in keyof O]: O[P] }
type RuleValue = {
  filetypes: Set<string>,
  loaders: Map<LoaderName, Loader>,
  options: Map<string, any>
}

export interface Options {}

export default class Rule implements ITransform {
  public readonly name: string = 'Rule'
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
  private value: Map<RuleName, RuleValue>

  constructor() {
    this.value = new Map()
  }

  private ensureRule<O>(rule: RuleName,
                        filetypes?: FileTypes,
                        loaders?: Loaders,
                        options?: RuleOption<O>): RuleValue {
    const value: RuleValue | undefined = this.value.get(rule)
    if(!isUndefined(value)) return value
    return this.initRule(rule, filetypes, loaders, options)
  }

  private initRule<O>(rule: RuleName,
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

  public setRule<O>(rule: RuleName,
                    filetypes?: FileTypes,
                    loaders?: Loaders,
                    options?: RuleOption<O>): this {
    this.ensureRule(rule, filetypes, loaders, options)
    return this
  }

  public deleteRule(rule: RuleName): this {
    this.value.delete(rule)
    return this
  }

  public setRules(rules: Array<{ rule: RuleName,
                                 filetypes?: FileTypes,
                                 loaders?: Loaders,
                                 options?: RuleOption<any> }>): this {
    rules.forEach(this.setRule.bind(this))
    return this
  }

  public clearRules(): this {
    this.value.clear()
    return this
  }

  public addRuleFileType(rule: RuleName, type: string): this {
    this.ensureRule(rule).filetypes.add(type)
    return this
  }

  public deleteRuleFileType(rule: RuleName, type: string): this {
    this.ensureRule(rule).filetypes.delete(type)
    return this
  }

  public setRuleFileTypes(rule: RuleName, types: FileTypes): this {
    this.ensureRule(rule).filetypes = new Set(types)
    return this
  }

  public clearRuleFileTypes(rule: RuleName): this {
    this.ensureRule(rule).filetypes.clear()
    return this
  }

  public setRuleOption<V>(rule: RuleName, key: string, value: V): this {
    this.ensureRule(rule).options.set(key, value)
    return this
  }

  public deleteRuleOption(rule: RuleName, key: string): this {
    this.ensureRule(rule).options.delete(key)
    return this
  }

  public setRuleOptions(rule: RuleName, options: RuleOption<any>): this {
    this.ensureRule(rule).options = new Map(Object.entries(options || {}))
    return this
  }

  public clearRuleOptions(rule: RuleName): this {
    this.ensureRule(rule).options = new Map()
    return this
  }

  private ensureRuleLoader<O>(rule: RuleName,
                              loaderName: LoaderName,
                              loader?: { use?: any, options?: LoaderOption<O> }): Loader {
    const _rule = this.ensureRule(rule)
    const value: Loader | undefined = _rule.loaders.get(loaderName)
    if(!isUndefined(value)) return value
    return this.initRuleLoader(_rule, loaderName, loader || {})
  }

  private initRuleLoader<O>(rule: RuleValue,
                            loaderName: LoaderName,
                            { use, options }: { use?: any, options?: LoaderOption<O> }): Loader {
    const value: Loader = {
      use,
      options: new Map(Object.entries(options || {}))
    }
    rule.loaders.set(loaderName, value)
    return value
  }

  public setRuleLoader<O>(rule: RuleName,
                          loaderName: LoaderName,
                          loader?: Loader): this {
    this.ensureRuleLoader(rule, loaderName, loader)
    return this
  }

  public deleteRuleLoader(rule: RuleName, loader: LoaderName): this {
    this.ensureRule(rule).loaders.delete(loader)
    return this
  }

  public setRuleLoaders(rule: RuleName, loaders: Loaders): this {
    Object.keys(loaders).forEach(loader => {
      this.setRuleLoader(rule, loader, loaders[loader])
    })
    return this
  }

  public clearRuleLoaders(rule: RuleName): this {
    this.ensureRule(rule).loaders.clear()
    return this
  }

  public setRuleLoaderUse(rule: RuleName, loader: LoaderName, use?: any): this {
    this.ensureRuleLoader(rule, loader).use = use
    return this
  }

  public deleteRuleLoaderUse(rule: RuleName, loader: LoaderName): this {
    return this.setRuleLoaderUse(rule, loader)
  }

  public setRuleLoaderOption<V>(rule: RuleName, loader: LoaderName, key: string, value: V): this {
    this.ensureRuleLoader(rule, loader).options.set(key, value)
    return this
  }

  public deleteRuleLoaderOption(rule: RuleName, loader: LoaderName, key: string): this {
    this.ensureRuleLoader(rule, loader).options.delete(key)
    return this
  }

  public setRuleLoaderOptions(rule: RuleName, loader: LoaderName, options: LoaderOption<any>): this {
    this.ensureRuleLoader(rule, loader).options = new Map(Object.entries(options))
    return this
  }

  public clearRuleLoaderOptions(rule: RuleName, loader: LoaderName): this {
    this.ensureRuleLoader(rule, loader).options.clear()
    return this
  }

  public transform(setWebpackOptions: webpackOptionSetter): void {
    const rules: Array<webpack.RuleSetRule> = []

    this.value.forEach(({ filetypes, loaders, options }, rule) => {
      const uses: Array<{ loader: any, options: Object }> = []

      loaders.forEach(({ use, options: loaderOptions }, loader) => {
        const loaderOpts = {}
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

      const opts = {}
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

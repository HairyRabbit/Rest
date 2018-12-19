/**
 * create builder
 */

import * as webpack from 'webpack'
import { set, isFunction, isArray, isString, isUndefined, cloneDeep, startCase } from 'lodash'
import { inspect } from 'util'
import { Dependencies,
         report as reportDependencyValidateResult,
         install as installMissDependencies } from './dep'
import { Logger } from './logger'
import * as buildInPresets from './presets'
import * as buildInTransforms from './transforms'
import { parsePresetOptions, PresetOption, IPreset, IPresetConstructor } from './preset'


/// code

export enum Mode {
  Prod = 'production',
  Dev  = 'development',
  None = 'none'
}

export const DEFAULT_MODES: Array<string> = [ Mode.Prod, Mode.Dev, Mode.None ]
export const DEFAULT_MODEALIAS = {
  [Mode.None]: '',
  [Mode.Prod]: 'Prod',
  [Mode.Dev]: 'Dev'
}

export interface webpackOptionSetter {
  <V>(key: string, value: V): Builder
}
export interface ITransform {
  readonly name: string
  readonly exports: Array<string>
  transform(setWebpackOptions: webpackOptionSetter,
            webpackOptions: webpack.Configuration): void
}

export interface ITransformConstructor<O> {
  new (builder: Builder, options: O): ITransform
}

export enum DependencyFlag { Dev = 'D', Prod = 'P'}

export interface DependencyOptions<O> {
  readonly flag?: DependencyFlag
  assert?(options?: O): boolean
}

const DEFAULT_DEPENDENCYOPTIONS: DependencyOptions<never> = {
  flag: DependencyFlag.Dev
}

export type ModeDefintion = string | [ string, string ]


export interface Options {
  readonly context?: string
  readonly mode?: Mode
  readonly modeList?:
    | Array<ModeDefintion>
    | ((modes: typeof DEFAULT_MODES) => Array<ModeDefintion>)
  readonly check?: boolean
  readonly installOnCheckFail?: boolean
  readonly logger?: Logger
  readonly debug?: boolean
}

export class Builder {
  public readonly context: string
  public webpackOptions: webpack.Configuration
  private readonly transforms: { [transform: string]: ITransform }
  private readonly presets: { [preset: string]: IPreset }
  private readonly mode: string
  private readonly modeList: Array<string>
  private readonly modeAlias: { [mode: string]: string }
  private deps: Dependencies<Options>
  [setter: string]: any

  constructor({ context = process.cwd(),
                modeList = DEFAULT_MODES,
                mode,
                check = true,
                installOnCheckFail = false,
                logger = console,
                ...options }: Options = {}) {

    this.webpackOptions = {}
    this.context = context

    const [ ml, ma ] = normalizeModeList(
      isFunction(modeList) ? modeList(DEFAULT_MODES) : modeList
    )
    this.modeList = ml
    this.modeAlias = ma
    this.mode = mode || parseModeFromEnv(this.modeList) || Mode.Dev

    this.check = check
    this.installOnCheckFail = installOnCheckFail
    this.logger = logger
    this.options = options

    this.transforms = {}
    this.presets = {}
    this.deps = new Dependencies(this.options)

    this.init()
  }

  private init(): this {
    /**
     * export core `set` method
     */
    this.modeList.forEach(mode => {
      this['set' + this.modeAlias[mode]] = this.callWithMode(this.set, this, mode)
    })

    return this
  }

  private callWithMode(fn: Function,
                       transform: ITransform | this,
                       mode?: Builder['mode']) {
    return (...args: Array<any>): this => {
      if(mode !== Mode.None && mode !== this.mode) return this
      fn.apply(transform, args)
      return this
    }
  }

  private export(transform: ITransform): this {
    transform.exports.forEach(name => {
      const fn = transform[name]
      this.modeList.forEach(mode => {
        this[name + this.modeAlias[mode]] = this.callWithMode(fn, transform, mode)
      })
    })
    return this
  }

  private set<V>(key: string, value: V): this {
    set(this.webpackOptions, key, value)
    return this
  }

  public use<O>(PresetConstructor: IPresetConstructor<O>, options?: O): this {
    const preset = new PresetConstructor()
    const { name, use, dependencies } = preset

    /**
     * if preset already mount, do nothing
     */
    if(this.presets[name]) return this

    /**
     * mount preset
     */
    if(!isUndefined(use)) {
      parsePresetOptions(use).forEach(({ preset, options}) => {
        /**
         * should not merge options from `this.options`
         */
        this.use(preset, options)
      })
    }

    /**
     * normalize and push to `this.deps`
     */
    if(isArray(dependencies)) {
      dependencies.forEach(dep => { this.deps.create(dep, name) })
    }

    preset.apply(this, options)
    this.presets[name] = preset

    return this
  }

  public useTransform<O>(Transform: ITransformConstructor<O>): this {
    const transform = new Transform(this, this.options)
    if(this.transform[transform.name]) return this
    this.transforms[transform.name] = transform
    this.export(transform)
    return this
  }

  public transform(): webpack.Configuration {
    let promise: Promise<boolean> | undefined = undefined
    /**
     * check `deps` when `check` options was enabled
     */
    if(false !== this.check) {
      const result = this.deps.validate()
      if(!result[0]) {
        const miss: Array<string> = reportDependencyValidateResult(result[1], { logger: this.logger })

        if(this.installOnCheckFail) {
          const installResult: boolean = installMissDependencies(miss, { logger: this.logger })
        }
      }
    }

    /**
     * start transform
     */
    this.set('context', this.context)
    this.set('mode', this.mode)

    Object.keys(this.transforms).forEach(name => {
      this.transforms[name].transform(this.set, this.webpackOptions)
    })

    return cloneDeep(this.webpackOptions)
  }

  public print(): void {
    this.logger.info(inspect(this.transform(), { depth: Infinity }))
  }
}

type ReturnType = [ Array<string>, { [mode: string]: string} ]
function normalizeModeList(modeList: Array<ModeDefintion>): ReturnType {
  return modeList.reduce<ReturnType>(([ modes, aliases ], curr) => {
    const [ mode, alias ] = (
      isArray(curr)
        ? curr
        : [ curr, !isUndefined(DEFAULT_MODEALIAS[curr])
                    ? DEFAULT_MODEALIAS[curr]
                    : curr
          ]
    )
    modes.push(mode)
    aliases[mode] = alias
    return [ modes, aliases ]
  }, [ [], {} ])
}

function parseModeFromEnv(modeList: Array<string>): string | undefined {
  const env: string | undefined = process.env.NODE_ENV
  if(!env || ~modeList.indexOf(env)) return undefined
  return env
}

export type BuilderOptions =
  & Options
  & buildInTransforms.EntryOptions
  & buildInTransforms.PluginOptions
  & buildInTransforms.RuleOptions

/**
 * create a builder instance, can some preload presets
 *
 * @param presets
 * @param options
 */
export default function createBuilder(presets?: PresetOption<{}>,
                                      options?: BuilderOptions): Builder {
  const builder: Builder = new Builder(options)

  /**
   * preload build-in transforms and presets
   */
  Object.values(buildInTransforms)
    .filter(t => isFunction(t))
    .forEach(t => builder.useTransform(t))
  builder.use(buildInPresets.Default)

  /**
   * preload presets
   */
  if(presets) {
    parsePresetOptions(presets).forEach(({ preset, options }) => {
      builder.use(preset, options)
    })
  }

  return builder
}

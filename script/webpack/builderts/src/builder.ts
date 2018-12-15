/**
 * create builder
 */

import * as webpack from 'webpack'
import { set, isFunction, isArray, isString, isUndefined } from 'lodash'
import Entry, { Options as EntryOptions} from './transform/entry'
import Plugin, { Options as PluginOptions} from './transform/plugin'
import Rule, { Options as RuleOptions} from './transform/rule'
import DefaultPreset from './preset/default'
import npm from 'npm'


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

export interface IPreset<O = {}> {
  readonly name: string
  readonly dependencies: Array<string>
  readonly use: string | Array<string>
  apply(builder: Builder, options?: O): void
}

export interface IPresetConstructor<O = {}> {
  new (): IPreset<O>
}

export type ModeDefintion = string | [ string, string ]

export interface Logger {
  info(...optionalParams: Array<any>): void
  warn(...optionalParams: Array<any>): void
  error(...optionalParams: Array<any>): void
}

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

export interface IBuilder {
  transform(): webpack.Configuration | Promise<webpack.Configuration>
  use<O>(preset: IPresetConstructor<O>, options?: O): this
  useTransform<O>(transform: ITransformConstructor<O>): this
  [setter: string]: Function
}

interface IPresetOption<O = {}> {
  readonly preset: string,
  readonly options?: O
}

type PresetOption =
  | string
  | Array<string | IPresetOption>

class Builder implements IBuilder {
  private webpackOptions: webpack.Configuration
  private readonly transforms: { [transform: string]: ITransform }
  private readonly preloadPresets: Array<IPresetOption>
  private readonly presets: { [preset: string]: IPreset }
  public readonly context: string
  private readonly mode: string
  private readonly modeList: Array<string>
  private readonly modeAlias: { [mode: string]: string }
  private deps: { [dep: string]: Array<string> }
  [setter: string]: any

  constructor(presets: PresetOption = [],
              { context = process.cwd(),
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

    this.preloadPresets = parserPresets(presets)
    this.check = check
    this.installOnCheckFail = installOnCheckFail
    this.logger = logger
    this.options = options

    this.transforms = {}
    this.presets = {}
    this.deps = {}

    this.init()
  }

  private init(): this {
    /**
     * export core `set` method
     */
    this.modeList.forEach(mode => {
      this['set' + this.modeAlias[mode]] = this.callWithMode(this.set, this, mode)
    })

    /**
     * mount presets from initial
     */
    this.preloadPresets.forEach(presetOption => {
      const preset = loadPreset(presetOption)
      const options = { ...presetOption, ...this.options[presetOption.preset] }
      this.use(preset, options)
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

  public use<O>(Preset: IPresetConstructor<O>, options?: O): this {
    const preset = new Preset()
    const { name, use, dependencies } = preset

    /**
     * if preset already mount, do nothing
     */
    if(this.presets[name]) return this

    /**
     * mount preset
     */
    if(!isUndefined(use)) {
      parserPresets(use).forEach(presetOption => {
        const _Preset = loadPreset(presetOption)
        /**
         * should not merge options from `this.options`
         */
        this.use(_Preset, presetOption.options)
      })
    }

    /**
     * push dependencies to `this.deps`
     */
    if(isArray(dependencies)) {
      dependencies.forEach(dep => {
        const deps = this.deps[dep]

        if(isArray(deps)) {
          if(!~deps.indexOf(name)) this.deps[dep].push(name)
        } else {
          this.deps[dep] = [ name ]
        }
      })
    }

    preset.apply(this, options)
    this.presets[name] = preset

    return this
  }

  public useTransform<O>(Transform: ITransformConstructor<O>): this {
    const transform = new Transform(this, this.options)
    this.transforms[transform.name] = transform
    this.export(transform)
    return this
  }

  public transform(): webpack.Configuration | Promise<webpack.Configuration> {
    let promise: Promise<boolean> | undefined = undefined
    /**
     * check `deps` when `check` options was enabled
     */
    if(false !== this.check) {
      const failed: Array<string> = []

      Object.keys(this.deps).forEach(dep => {
        if(!checkDep(dep)) {
          failed.push(dep)
        }
      })

      if(failed.length > 0) {
        reportFailed(failed, this.deps, this.logger)

        if(this.installOnCheckFail) {
          promise = installFailed(failed, this.logger).catch(error => {
            throw new Error(error)
          })
        }
      }
    }

    this.set('context', this.context)
    this.set('mode', this.mode)

    Object.keys(this.transforms).forEach(name => {
      this.transforms[name].transform(this.set, this.webpackOptions)
    })

    if(promise) return promise.then(() => this.webpackOptions)
    return this.webpackOptions
  }
}

function checkDep(dep: string): boolean {
  try {
    __non_webpack_require__.resolve(dep)
  } catch(e) {
    return false
  }
  return true
}

function installFailed(failed: Array<string>, logger: Logger): Promise<boolean> {
  return new Promise((resolve, reject) => {
    npm.load({}, () => {
      npm.commands.install(failed, err => {
        if(err) reject(err)
        resolve(true)
      })
    })
  })
}

function reportFailed(failed: Array<string>,
                      deps: { [dep:string]: Array<string> },
                      logger: Logger): void {
  const message: Array<string> = []
  failed.forEach(dep => {
    message.push(`  - ${dep} was not found, requied by ${deps[dep].join(' ')}`)
  })
  logger.warn(`dependencies checked result: \n\n ${message.join('\n')}`)
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

function parserPresets(presets: PresetOption): Array<IPresetOption> {
  if(isString(presets)) {
    return parserPresets(presets.split(','))
  } else if(isArray(presets)) {
    return presets.map(preset => {
      if(isString(preset)) return { preset, options: {} }
      return preset
    })
  } else {
    throw new Error(`Presets should be string or string[]`)
  }
}

function parseModeFromEnv(modeList: Array<string>): string | undefined {
  const env: string | undefined = process.env.NODE_ENV
  if(!env || ~modeList.indexOf(env)) return undefined
  return env
}

function loadPreset<O>({ preset }: IPresetOption): IPresetConstructor<O> {
  try {
    return require(`./preset/${preset}.ts`).default
  } catch(e) {}

  try {
    return __non_webpack_require__(`webpack-builder-preset-${preset}`).default
  } catch(e) {}

  throw new Error(`Can't find webpack-builder preset "${preset}"`)
}

export type BuilderOptions =
  & Options
  & EntryOptions
  & PluginOptions

export default function createBuilder(presets: string | Array<string>,
                                      options: BuilderOptions): Builder {
  const builder: Builder = new Builder(presets, options)

  return builder
    .useTransform(Entry)
    .useTransform(Plugin)
    .useTransform(Rule)
    .use(DefaultPreset)
}

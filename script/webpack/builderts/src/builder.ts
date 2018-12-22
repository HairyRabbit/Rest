/**
 * create builder
 */

import * as webpack from 'webpack'
import path from 'path'
import { EventEmitter } from 'events'
import { get, set, isFunction, isArray, isUndefined, cloneDeep } from 'lodash'
import { inspect } from 'util'
import { Dependencies,
         report as reportDependencyValidateResult,
         install as installMissDependencies } from './dep'
import { Logger } from './logger'
import * as buildInPresets from './presets'
import * as buildInTransforms from './transforms'
import { parsePresetOptions, PresetOption, IPreset, IPresetConstructor } from './preset'
import { Mode } from './mode'


/// code

export const DEFAULT_MODES: Array<string> = [ Mode.Prod, Mode.Dev, Mode.None ]
export const DEFAULT_MODEALIAS: { [ k in Mode ]: string } = {
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
  [key: string]: any & { [K in keyof typeof import('./transforms')]: (typeof import('./transforms'))[K]}[keyof typeof import('./transforms')]
}

export interface ITransformConstructor<O> {
  new (builder: Builder, options: O): ITransform
}

export type ModeDefintion = string | [ string, string ]


export interface Options {
  readonly root?: string
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

export class Builder extends EventEmitter {
  public readonly root: string
  public readonly context: string
  public webpackOptions: webpack.Configuration
  private readonly transforms: { [transform: string]: ITransform }
  private readonly presets: { [preset: string]: IPreset<any> }
  public readonly mode: string
  private readonly modeList: Array<string>
  private readonly modeAlias: { [mode: string]: string }
  private deps: Dependencies<Options>
  private readonly check: boolean = true
  public transformed: boolean = false
  private readonly logger: Logger = console
  private readonly installOnCheckFail: Options['installOnCheckFail'] = false
  private readonly options: any
  public pkg!: { [key: string]: any }

  [setter:string]: { [ K in keyof this]: this[K] | ((a: any) => this) }[keyof this]

  constructor({ context = process.cwd(),
                root = process.cwd(),
                modeList = DEFAULT_MODES,
                mode,
                check = true,
                installOnCheckFail = false,
                logger = console,
                ...options }: Options = {}) {
    super()
    this.webpackOptions = {}
    this.context = context
    this.root = root

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
    this.transformed = false

    this.init()
  }

  private init(): this {
    /**
     * try load `package.json`
     */
    this.pkg = __non_webpack_require__(path.resolve(this.root, 'package.json'))

    /**
     * exports `set` method
     */
    this.modeList.forEach(mode => {
      this['set' + this.modeAlias[mode]] = this.callWithMode(this.set, this, mode) as any
    })

    return this
  }

  private callWithMode(fn: Function,
                       transform: ITransform | this,
                       mode?: Builder['mode']) {
    return (...args: Array<any>): this => {
      // if(this.transformed) return this
      if(mode !== Mode.None && mode !== this.mode) return this
      fn.apply(transform, args)
      return this
    }
  }

  private export(transform: ITransform): this {
    transform.exports.forEach(name => {
      const fn = transform[name]
      this.modeList.forEach(mode => {
        this[name + this.modeAlias[mode]] = this.callWithMode(fn, transform, mode) as any
      })
    })
    return this
  }

  public setDev!: Builder['set']
  public setProd!: Builder['set']
  public set<V>(key: string, value: V): this {
    set(this.webpackOptions, key, value)
    return this
  }

  public get<V>(key: string, defaults?: V): any {
    return get(this.webpackOptions, key) || defaults
  }

  public use<O>(PresetConstructor: IPresetConstructor<O>, options?: O): this {
    const preset: IPreset<O> = new PresetConstructor((options || {}) as O)
    const { name, use, dependencies } = preset

    /**
     * if preset already mount, do nothing
     */
    if(this.presets[name]) return this

    /**
     * mount preset
     */
    if(!isUndefined(use)) {
      parsePresetOptions(use as PresetOption).forEach(({ preset, options}) => {
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
    if(this.transforms[transform.name]) return this
    this.transforms[transform.name] = transform
    this.export(transform)
    return this
  }

  public transform(): webpack.Configuration {
    /**
     * check `deps` when `check` options was enabled
     */
    if(false !== this.check) {
      const result = this.deps.validate()
      if(!result[0]) {
        const miss: Array<string> = reportDependencyValidateResult(result[1], { logger: this.logger })

        if(this.installOnCheckFail) {
            installMissDependencies(miss, { logger: this.logger })
        }
      }
    }

    /**
     * start transform
     */
    Object.keys(this.presets).forEach(name => {
      const preset = this.presets[name]
      if(!isFunction(preset.applyTransform)) return
      preset.applyTransform(this, preset.options)
    })

    if(this.pkg.name) this.set('name', this.pkg.name)
    if(this.context) this.set('context', this.context)
    this.set('mode', this.mode)

    Object.keys(this.transforms).forEach(name => {
      this.transforms[name].transform(this.set, this.webpackOptions)
    })

    this.transformed = true
    return cloneDeep(this.webpackOptions)
  }

  public print(): this {
    this.logger.info(inspect(this.transform(), { depth: Infinity }))
    return this
  }

  public report(): this {
    return this
  }
}

type ReturnType = [ Array<string>, { [mode: string]: string} ]
function normalizeModeList(modeList: Array<ModeDefintion>): ReturnType {
  return modeList.reduce<ReturnType>(([ modes, aliases ], curr) => {
    const [ mode, alias ] = (
      isArray(curr)
        ? curr
        : [ curr, !isUndefined(DEFAULT_MODEALIAS[curr as Mode])
                    ? DEFAULT_MODEALIAS[curr as Mode]
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
  // console.log(process.env.NODE_ENV, env)
  if(!env || ~modeList.indexOf(env)) return undefined
  // if(!env) return undefined
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
   * mount build-in transforms
   */
  Object.values(buildInTransforms)
    .filter(t => isFunction(t))
    .forEach(t => builder.useTransform(t))

  /**
   * mount `Default` preset
   */
  builder.use(buildInPresets.Default)

  /**
   * mount presets from arguments
   */
  if(presets) {
    parsePresetOptions(presets).forEach(({ preset, options }) => {
      builder.use(preset, options)
    })
  }

  return builder
}

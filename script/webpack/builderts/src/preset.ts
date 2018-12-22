/**
 *
 */

import { isString, isArray, startCase } from 'lodash'
import { Builder, Options as BuilderOptions } from './builder'
import { DependencyCompose, requireModule } from './dep'
import * as buildInPresets from './presets'


/// code

export interface IPreset<O = {}> {
  options: O
  readonly name: string
  readonly dependencies: Array<DependencyCompose<BuilderOptions & O>>
  readonly use: PresetOption<O>
  apply(builder: Builder, options?: O): void
  applyTransform?(builder: Builder, options?: O): void
}

export interface IPresetConstructor<O = {}> {
  new (o: O): IPreset<O>
}

interface IPresetOption<O = {}> {
  readonly preset: IPresetConstructor<O>,
  readonly options?: O
}

type PresetOptionItem<O> = string | IPresetConstructor<O>
export type PresetOption<O = {}> =
  | PresetOptionItem<O>
  | Array<PresetOptionItem<O> | [ PresetOptionItem<O>, O?] | IPresetOption<O>>

export default abstract class Preset<Options> implements IPreset<Options & BuilderOptions> {
  abstract readonly name: string
  abstract readonly dependencies: Array<DependencyCompose<Options & BuilderOptions>>
  abstract readonly use: PresetOption<Options>
  abstract apply(builder: Builder, options?: Options): void
  constructor(public options: Options) { this.options = options }
}

export function parsePresetOptions(presets: PresetOption): Array<IPresetOption> {
  /**
   * `builder.use('foo,bar')`
   */
  if(isString(presets)) return parsePresetOptions(presets.split(','))

  /**
   * `builder.use(Script)`
   */
  if(presets instanceof Preset) return [{ preset: presets as IPresetConstructor, options: {} }]

  if(isArray(presets)) {
    return presets.map(_preset => {
      const [ preset, options ] = isArray(_preset) ? _preset : [ _preset, {} ]

      if(preset instanceof Preset) {
        return { preset, options }
      } else if(isString(preset)) {

        type PresetsTypes = typeof import('./presets')
        interface PresetsIndexerType {
          [k: string]: { [K in keyof PresetsTypes]: PresetsTypes[K] }[keyof PresetsTypes]
        }

        const tryBuildIn = (buildInPresets as PresetsIndexerType)[startCase(preset)]
        if(tryBuildIn) return { preset: tryBuildIn, options }
        return requireModule(`webpack-builder-preset-${preset}`)
      } else {
        return preset
      }
    })
  } else {
    throw new Error(`Unknow presets type "${typeof presets}"`)
  }
}

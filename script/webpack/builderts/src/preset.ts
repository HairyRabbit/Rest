/**
 *
 */

import { isString, isArray, startCase } from 'lodash'
import { Builder, Options as BuilderOptions } from './builder'
import { DependencyCompose, requireModule } from './dep'
import * as buildInPresets from './presets'


/// code

export interface IPreset<O = {}> {
  readonly name: string
  readonly dependencies: Array<DependencyCompose<BuilderOptions>>
  readonly use: PresetOption<O>
  apply(builder: Builder, options?: O): void
}

export interface IPresetConstructor<O> {
  new (o?: O): IPreset<O>
}

interface IPresetOption<O> {
  readonly preset: IPresetConstructor<O>,
  readonly options?: O
}

type PresetOptionItem<O> = string | IPresetConstructor<O>
export type PresetOption<O> =
  | PresetOptionItem<O>
  | Array<PresetOptionItem<O> | IPresetOption<O>>

export default abstract class Preset<Options> implements IPreset<Options & BuilderOptions> {
  abstract readonly name: string
  abstract readonly dependencies: Array<DependencyCompose<Options & BuilderOptions>>
  abstract readonly use: PresetOption<Options>
  abstract apply(builder: Builder, options?: Options): void
}

export function parsePresetOptions<O>(presets: PresetOption<O>): Array<IPresetOption<O>> {
  if(isString(presets)) {
    return parsePresetOptions(presets.split(','))
  } else if(presets instanceof Preset) {
    return [{ preset: presets, options: {} }] as Array<{ preset: IPresetConstructor<O>, options: any }>
  } else if(isArray(presets)) {
    return presets.map(_preset => {
      const [ preset, options ] = isArray(_preset) ? _preset : [ _preset, {} ]

      if(preset instanceof Preset) {
        return { preset, options }
      } else if(isString(preset)) {
        const tryBuildIn = buildInPresets[startCase(preset)]
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

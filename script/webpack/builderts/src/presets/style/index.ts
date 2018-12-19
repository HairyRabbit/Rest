/**
 * used for styles
 */

import Preset, { PresetOption } from "../../preset"
import { Builder } from "../../builder"
import { DependencyCompose } from "../../dep"

export enum Compiler { Sass = 'sass', Less = 'less' }

export interface Options {
  readonly global?: string
  readonly compiler?: boolean | Compiler
}

export default class StylePreset extends Preset<Options> {
  public readonly name: string = 'script'
  public readonly use: PresetOption<Options> = []
  public readonly dependencies: Array<DependencyCompose<any>> = [
    'style-loader',
    'css-loader',
    'sass-loader'
  ]

  apply(builder: Builder, { global, compiler = Compiler.Sass }: Options = {}): void {
    builder
      .setRuleFileTypes(this.name, ['css', 'scss', 'sass'])
      .setRuleLoader(this.name, 'style-loader')
      .setRuleLoader(this.name, 'css-loader')
      .setRuleLoader(this.name, 'sass-loader')
  }
}

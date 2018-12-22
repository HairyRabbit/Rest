/**
 * node lib preset
 *
 * - support HMR for development
 *
 * @see [webpack-node-externals](https://github.com/liady/webpack-node-externals)
 */

import webpack from "webpack"
import Preset, { PresetOption } from "../../preset"
import { DependencyCompose, requireModule } from "../../dep"
import { Builder } from "../../builder"


/// code

export interface Options {
  readonly name?: string,
  readonly target?: webpack.LibraryTarget
}

export default class CliPreset extends Preset<Options> {
  public readonly name: string = 'cli'
  public readonly use: PresetOption = [['nodelib']]
  public readonly dependencies: Array<DependencyCompose<Options>> = [
    'yargs'
  ]

  public apply(builder: Builder, { name = 'index',
                                   target = 'commonjs2'}: Options = {}): void {



    builder
      .set('name', name)
      .addEntryPrependDev('main', 'webpack/hot/poll?1000')
      .setEntryName('main', name)
      .setEntryModuleDev('main', (m?: string) => m ? m + '?boot' : m)
      .setRuleLoaderDev('script', 'patch-entry-loader', { use: __non_webpack_require__.resolve('./nodelib-pitch-loader') })
      .set('output.filename', '[name].js')
      .set('output.library', name)
      .set('output.libraryTarget', target)
      .set('target', 'node')
      .set('node', false)
      .setPluginDev('hmr', webpack.HotModuleReplacementPlugin)
  }
}

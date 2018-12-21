/**
 * node lib preset
 *
 * - support HMR for development
 *
 * @see [webpack-node-externals](https://github.com/liady/webpack-node-externals)
 */

import * as path from 'path'
import webpack from "webpack"
import ScriptPreset from '../script'
import Preset, { PresetOption } from "../../preset"
import { DependencyCompose, requireModule } from "../../dep"
import { Builder } from "../../builder"


/// code

export interface Options {
  readonly name?: string,
  readonly target?: webpack.LibraryTarget
  readonly nodeExternals?: NodeExternalsOptions
}

export default class NodeLibPreset extends Preset<Options> {
  public readonly name: string = 'nodelib'
  public readonly use: PresetOption<Options> = 'script'
  public readonly dependencies: Array<DependencyCompose<Options>> = [
    'webpack-node-externals'
  ]

  public apply(builder: Builder, { name,
                                   target,
                                   nodeExternals = {} }: Options = {}): void {

    const nodeExternalsOptions: NodeExternalsOptions = {
      ...nodeExternals,
      whitelist: [
        ...(nodeExternals.whitelist || []),
        /webpack\/hot\/[^]+/
      ]
    }

    builder
      .set('name', name)
      .addEntryPrependDev('main', 'webpack/hot/poll?1000')
      .setEntryName('main', name)
      .setEntryModule('main', (m?: string) => m ? m + '?boot' : m)
      .setRuleLoader('script', 'patch-entry-loader', { use: path.resolve('./nodelib-pitch-loader') })
      .set('output.filename', '[name].js')
      .set('output.library', name)
      .set('output.libraryTarget', target)
      .set('target', 'node')
      .set('node', false)
      .set('externals', requireModule('webpack-node-externals')(nodeExternalsOptions))
      .setPluginDev('hmr', webpack.HotModuleReplacementPlugin)
  }
}

interface NodeExternalsOptions {
  whitelist?: Array<string | RegExp>
  importType?: 'root' | 'commonjs' | 'commonjs2' | 'amd'
  modulesDir?: string
  modulesFromFile?: boolean | { include?: Array<string>, exclude?: Array<string> }
}

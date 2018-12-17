/**
 * default preset
 */

import { Builder } from '../builder'
import Preset from '../preset'
import sourcemapOverride from '../sourcemap-path-absolute'


/// code

export interface Options {}

export const DEFAULT_EXTENSIONS: Array<string> = ['.mjs', '.js', '.jsx', '.ts', '.tsx']

export default class DefaultPreset extends Preset<Options> {
  public readonly name = 'default'
  public readonly dependencies = [ 'webpack', 'webpack-cli' ]
  public readonly use = []

  apply(builder: Builder, options?: Options): void {
    const context = builder.context

    builder
      .setDev('output.filename', '[name].js')
      .setProd('output.filename', '[name].[contenthash].js')
      .set('output.publicPath', '/')
      .set('output.devtoolModuleFilenameTemplate', sourcemapOverride)
      .set('resolve.extensions', DEFAULT_EXTENSIONS)
      .setDev('devtool', 'inline-source-map')
      .setProd('devtool', 'hidden-source-map')
      .set('optimization.noEmitOnErrors', true)
  }
}
/**
 * default preset
 */

import { IPreset } from '../builder'
import sourcemapOverride from '../sourcemap-path-absolute'

export interface Options {}

export const DEFAULT_EXTENSIONS: Array<string> = ['.mjs', '.js', '.jsx', '.ts', '.tsx']

export default class DefaultPreset implements IPreset<Options> {
  public readonly name = 'default'
  public readonly dependencies = [ 'webpack', 'webpack-cli' ]
  public readonly use = []

  apply(builder, options?: Options): void {
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

/**
 * default preset
 *
 * @see [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)
 */

import { resolve } from 'path'
import { DevtoolModuleFilenameTemplateInfo } from 'webpack'
import { Builder } from '../builder'
import Preset from '../preset'


/// code

export interface Options {}

export const DEFAULT_EXTENSIONS: Array<string> = ['.mjs', '.js', '.jsx', '.ts', '.tsx']

export default class DefaultPreset extends Preset<Options> {
  public options: Options = {}
  public readonly name: string = 'base'
  public readonly use = []
  public readonly dependencies = [
    'webpack',
    'webpack-cli',
    'clean-webpack-plugin'
  ]
  public apply(builder: Builder, {}: Options = {}): void {
    builder
      .setDev('output.filename', '[name].js')
      .setProd('output.filename', '[name].[contenthash].js')
      .set('output.publicPath', '/')
      .set('output.devtoolModuleFilenameTemplate', format)
      .set('resolve.extensions', DEFAULT_EXTENSIONS)
      .setDev('devtool', 'inline-source-map')
      .setProd('devtool', 'hidden-source-map')
      .set('optimization.noEmitOnErrors', true)
      .setDev('optimization.removeAvailableModules', false)
      .setDev('optimization.removeEmptyChunks', false)
      .setDev('optimization.splitChunks', false)
  }

  public applyTransform(builder: Builder, {}: Options = {}) {
    builder.setPlugin('clean', 'clean-webpack-plugin', {
      paths: builder.get('output.path', 'dist'),
      verbose: false
    })
  }
}

function format(info: DevtoolModuleFilenameTemplateInfo): string {
  const protocol: string = 'file:///'
  const fmt: string = 'win32' === process.platform
    ? resolve(info.resourcePath)
        .replace(/\\/g, '\/')
        .replace(/(\w):/, (_, a) => a.toUpperCase() + ':')
    : resolve(info.resourcePath)

  return protocol + fmt
  // return info.allLoaders.length && !startsWith(info.allLoaders, 'css')
  //   ? prepend + fmt + `?${info.hash}`
  //   : prepend + fmt
}

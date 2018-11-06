/**
 * default preset, set better webpack default:
 *
 * - devtool
 * - output.devtoolModuleFilenameTemplate
 *
 * @flow
 */

import sourcemap from '../sourcemap-path-formatter'


/// code

export default function preset(builder: *): * {
  builder
    .setDev('output.filename', '[name].js')
    .setProd('output.filename', '[name].[contenthash].js')
    .set('output.publicPath', '/')
    .set('output.devtoolModuleFilenameTemplate', sourcemap)
    .setDev('devtool', 'inline-source-map')
    .setProd('devtool', 'hidden-source-map')
    .set('optimization.noEmitOnErrors', true)

  return builder
}

export const dependencies = [
  'webpack',
  'webpack-cli'
]


/// test

import * as assert from 'assert'

describe('webpack/builder default preset', () => {

})

/**
 * webpack config
 */

import path from 'path'
import Builder from '../script/webpack/builder'

const builder = builder => builder
      .setContext(__dirname)
      .setOutput(path.resolve(__dirname, 'build'))

export default [
  builder(Builder('spa'))
    .set('target', 'electron-main')
    .setEntry('main', path.resolve(__dirname, 'main/index.js'))
    .set('node', false)
    .deletePlugin('html')
    .transform(),
  builder(Builder('spa'))
    .set('target', 'electron-renderer')
    .deleteEntry('main')
    .setEntry('renderer', path.resolve(__dirname, 'renderer/boot.js'))
    .transform()
]

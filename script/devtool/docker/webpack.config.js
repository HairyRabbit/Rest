/**
 * docker ui webapck configs
 *
 * @flow
 */

import path from 'path'
import { DefinePlugin } from 'webpack'
import Builder from '../../../lib/webpack-builder'

export default Builder('icon,rest', {
  style: {
    gcssEntry: [
      path.resolve(__dirname, 'src/style.css')
    ]
  }
})
  .setContext(__dirname, 'src')
  .setEntryModule(path.resolve(__dirname, 'src/boot.js'))
  .set('devServer.proxy./api', {
    target: 'http://localhost:2375',
    pathRewrite: { ['^/api']: '' }
  })
  .setPlugin('env.fetchbase', DefinePlugin, {
    ['process.env.FETCH_BASE']: JSON.stringify('http://localhost:23333/api')
  })
  .set('resolve.alias.~', path.resolve(__dirname, 'src'))
  .set('resolve.alias.~util', path.resolve(__dirname, '../../../util'))
  .set('resolve.alias.~component', path.resolve(__dirname, '../../../component'))
  .set('resolve.alias.~style', path.resolve(__dirname, '../../../style'))
  .set('resolve.alias.@style', path.resolve(__dirname, '../../../style'))
  .transform(true)

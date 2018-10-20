/**
 * docker ui webapck configs
 *
 * @flow
 */

import path from 'path'
import Builder from '../../webpack/builder'

export default Builder('icon,rest', {
  gcssEntry: [
    path.resolve(__dirname, 'src/style.css')
  ]
})
  .setContext(__dirname)
  .setEntryEntry(path.resolve(__dirname, 'src/boot.js'), 'main')
  .set('devServer.proxy./api', {
    target: 'http://localhost:2375',
    pathRewrite: { ['^/api']: '' }
  })
  .set('resolve.alias.~', path.resolve(__dirname, 'src'))
  .set('resolve.alias.~util', path.resolve(__dirname, '../../../util'))
  .set('resolve.alias.~component', path.resolve(__dirname, '../../../component'))
  .set('resolve.alias.~style', path.resolve(__dirname, '../../../style'))
  .set('resolve.alias.@style', path.resolve(__dirname, '../../../style'))
  .transform()

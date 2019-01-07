/**
 * create-init cli, util for quickly create green project 
 * by advance default configure
 */

import app from './components'
import path from 'path'
import base, { Options as BaseOptions } from './base'
import { createRootTask } from './task'
import TaskManager from './manager'
import mkdir from './modules/mkdir'
import mkfile from './modules/mkfile'
import gitignore from './modules/gitignore'
import editorconfig from './modules/editorconfig'


/// code

export default function main() {
  // const context = process.cwd()
  // const options = {}
  // const root = createRootTask(context, options, base)
  // // <typeof options, [BaseOptions]>
  // app(root)
  // const tm = TaskManager([foo, bar, baz])
  const tm = TaskManager([
    [mkfile, { filepath: 'foo/bar/qux/bar.txt', content: '233'}],
    [mkfile, { filepath: 'foo/baz/qux/foo.txt', content: '445'}],
    // [gitignore, { addons: '' }],
    // [gitignore, {}],
    // [editorconfig, {}]
  ], path.resolve('./foo'))
  // console.log(tm)
  // tm.start()
  app(tm)
}

function sleep(ms) {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}

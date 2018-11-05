/**
 * webpack test runner
 *
 * @flow
 */

import * as path from 'path'
import MemoryFS from 'memory-fs'
import webpack from 'webpack'


/// code

export class Runner {
  fs: any
  compiler: any

  constructor() {
    this.context = path.resolve('')
    this.fs = new MemoryFS()
    this.promise = Promise.resolve()
  }

  addFile(filepath, content) {
    const fpath = path.resolve(this.context, filepath)
    const dirname = path.dirname(fpath)
    this.fs.mkdirpSync(dirname)
    this.fs.writeFileSync(fpath, content)
    return this
  }

  getFile(filepath) {
    const fpath = path.resolve(this.context, filepath)
    return this.fs.readFileSync(fpath, 'utf-8')
  }

  run(options = {}) {
    const { fs, context } = this
    options.context = context
    options.mode = 'none'
    options.optimization = {
      noEmitOnErrors: true,
      namedModules: true,
      namedChunks: true,
      providedExports: true,
      usedExports: true
    }
    options.plugins = options.plugin || []
    const compiler = this.compiler = webpack(options)
    compiler.inputFileSystem = fs
    compiler.outputFileSystem = fs
    this.promise = new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if(err) return reject(err)
        this.stats = stats.toJson()
        return resolve()
      })
    })
    return this
  }
  getResult() {
    this.promise = this.promise.then(() => {
      const output = this.getFile('./dist/main.js')
            .replace(/\/\*{6}\/(.*)/g, '')
            .trim()
      return '{' + output + '}'
    })
    return this
  }
  value(cb) {
    this.promise.then(cb)
  }
}

export default function runner(...args) {
  return new Runner(...args)
}


/// test

import assert from 'assert'

describe('Class Runner', () => {
  it('Runner.addFile should add file', () => {
    const fpath = './src/index.js'
    const content = 'export default 42'
    assert.deepStrictEqual(runner().addFile(fpath, content).getFile(fpath), content)
  })

  it('Runner.run', () => {
    const run = runner()
    run.addFile('./src/index.js', 'export { default as default } from "./a"')
      .addFile('./src/a.js', 'export default 42')
      .run({})
      .getResult()
      .value(ctx => {
        console.log(ctx)
      })
  })
})

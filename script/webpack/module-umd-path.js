/**
 * module-umd-path
 *
 * find library UMD file path by
 *
 * @module umd-extra/resolveUMDLibpath
 *
 * @example
 *
 * const { exportPath } = require('@rabbitcc/umd-extra')
 *
 * exportPath('jquery')
 *   //=> 'node_modules/jquery/dist/jquery.min.js'
 * exportPath('react')
 *   //=> 'node_modules/react/umd/react-production.min.js'
 *
 * @flow
 */

import { words, isEqual } from 'lodash'
import path from 'path'
import glob from 'glob'


/// code

function exportPath(name: string, isDev?: boolean, context?: string, log?: boolean = true): ?string {
  const suggests = `+(${['umd', 'dist', 'build', 'js'].join('|')})`
  const prefix = context
        ? context.replace(/\\/, '/') + '/'
        : './'

  const dir = `${prefix}node_modules/${name}/`
  const umdPath = `${suggests}/{${suggests}/,}`
  const fileName = !isDev
        ? '*([!.])?(.production).min.js'
        : '*([!.])?(.development).js'

  const libs = glob.sync(dir + umdPath + fileName)

  if(!libs.length) {

    /**
     * can't find file
     *
     * 1. find same name file 'foo(.min)?.js'
     * 2. find file that 'main' field of package.json
     */
    const dirpath = glob.sync(`${dir}${name}.min.js`)

    if(dirpath.length) {

      /**
       * find name file
       */
      return dirpath[0]

    } else {

      /**
       * find file by package.json.main
       */
      let main
      try {
        main = require(path.resolve(`${prefix}node_modules/${name}/package.json`)).main
      } catch(err) {
        throw new Error(
          `The file "${name}" package.json file not exists`
        )
      }

      if(main) {

        /**
         * find file by main field
         */
        return `${prefix}node_modules/${name}/${main}`

      } else {

        /**
         * can't define "main" field
         */
        return null
      }
    }
  } else if (1 === libs.length) {

    /**
     * find one file
     */
    return libs[0]

  } else {

    /**
     * find more then one files
     */
    return suggest(name, libs)
  }
}

/**
 * select most matching path name.
 *
 * sort by:
 *   1. mostly match
 *   2. deeper path
 *   3. shorter name
 *
 * @example
 *
 * suggest('foo', ['foo-bar', 'Foo'])
 *   //=> 'Foo'
 *
 * suggest('foo', ['dist/foo', 'dist/dist/foo'])
 *   //=> 'dist/dist/foo'
 *
 * suggest('foo', ['fooBar', 'foo-bar-baz'])
 *   //=> 'fooBar'
 *
 */
function suggest (name: string, arr: Array<string>): string {
  /**
   * format name when name ends with '.js'
   */
  name = name.endsWith('.js') ? name.slice(0, -3) : name
  name = words(name)

  const namecases = arr.filter(name => {
    const basename = path.basename(name)
    const filename = basename.slice(0, basename.indexOf('.'))
    return isEqual(name, words(filename))
  })

  const len = namecases.length

  if (len === 1) {
    return namecases[0]
  } else if (len > 1) {
    return namecases.sort().reverse()[0]
  } else {
    return arr.sort(sortByWordsLength)[0]
  }

  function sortByWordsLength(a: string, b: string): number {
    return words(a).length - words(b).length
  }
}


/// export

export default exportPath


/// test

import assert from 'assert'

describe('script umdPath()', () => {
  it('', () => {

  })

  it('suggest(), should matched by name', () => {
    assert(suggest('foo', ['foo-bar', 'foo']), 'foo')
  })

  it('suggest(), should matched by deeper path', () => {
    assert(suggest('foo', ['dist/foo', 'dist/dist/foo']), 'dist/dist/foo')
  })

  it('suggest(), should matched by deeper path', () => {
    assert(suggest('foo', ['dist/foo', 'dist/dist/foo']), 'dist/dist/foo')
  })

  it('suggest(), should matched the first one with same deep path', () => {
    assert(suggest('foo', ['dist/foo', 'build/foo']), 'dist/foo')
  })

  it('suggest(), should matched by short one word length', () => {
    assert(suggest('foo', ['fooBar', 'foo-bar-baz']), 'fooBar')
    assert(suggest('foo', ['fooBar', 'fooba']), 'fooba')
  })

  it('suggest(), should matched the first by same word length', () => {
    assert(suggest('foo', ['fooBar', 'fooBaz']), 'fooBar')
  })
})

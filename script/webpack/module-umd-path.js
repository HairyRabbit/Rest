/**
 * resolve-umd-libpath
 *
 * Find installed library UMD file path.
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


/// CODE

import { words, isEqual } from 'lodash'
import path from 'path'
import glob from 'glob'


export default function exportPath(libname: string, isDev?: boolean, context?: string, log?: boolean = true): Promise<?string> {
  const dirResolver = makeGlobPatten(['umd', 'dist', 'build', 'js'])
  const pathPrefix = context ? context.replace(/\\/, '/') + '/' : './'
  const directoryPath = `${pathPrefix}node_modules/${libname}/`
  const umdPathName = `${dirResolver}/{${dirResolver}/,}`
  const fileName = !isDev
        ? '*([!.])?(.production).min.js'
        : '*([!.])?(.development).js'
  const libraryUMDPath = directoryPath + umdPathName + fileName
  const libraries = glob.sync(libraryUMDPath)
  if(libraries.length === 0) {
    /**
     * can't find from libraryUMDPath
     *
     * 1. find same name file 'foo(.min)?.js' in libpath
     * 2. then find by 'main' field of package.json
     */
    const dirpath = glob.sync(`${directoryPath}${libname}.min.js`)

    if(dirpath.length) {
      return dirpath[0]
    } else {
      let main
      try {
        main = require(path.resolve(`${pathPrefix}node_modules/${libname}/package.json`)).main
      } catch(err) {}

      if(main) {
        if(log) {
          console.warn(`[umd-extra] Can't find ${libname}, resolve by main filed of package.json`)
        }
        return `${pathPrefix}node_modules/${libname}/${main}`
      } else {
        if(log) {
          console.warn(`[umd-extra] Can't find module path '${libname}'.`)
        }
        return null
      }
    }
  } else if (libraries.length === 1) {
    return libraries[0]
  } else {
    return suggest(libname, libraries)
  }
}


/// HELPERS

/**
 * Make glob pattens.
 *
 * @private
 *
 * @example
 * makeGlobPatten([foo, bar]) //=> "+(foo|bar)"
 *
 * @param {Array<string>} arr
 * @return {string}
 */
export function makeGlobPatten (arr: Array<string>): string {
  return `+(${arr.join('|')})`
}

/**
 * Select most matching path name.
 *
 * @private
 *
 * @example
 * // 1. Most matching
 * suggest('foo', ['foo-bar', 'Foo'])
 *   //=> 'Foo'
 *
 * // 2. Deepest path
 * suggest('foo', ['dist/foo', 'dist/dist/foo'])
 *   //=> 'dost/dist/foo'
 *
 * // 3. Shortest name
 * suggest('foo', ['fooBar', 'foo-bar-baz'])
 *   //=> 'fooBar'
 *
 * @param {string} libname
 * @param {Array<string>} arr - library paths
 * @return {string}
 */
export function suggest (libname: string, arr: Array<string>): string {
  /**
   * Format libname when name ends with '.js'
   */
  libname = libname.endsWith('.js') ? libname.slice(0, -3) : libname
  libname = words(libname)

  const namecases = arr.filter(name => {
    const basename = path.basename(name)
    const filename = basename.slice(0, basename.indexOf('.'))
    return isEqual(libname, words(filename))
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

/**
 * gutter-parser
 *
 * parse gutter value
 *
 * @flow
 */

/// code

export type GutterSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

type GutterParseResult =
  | [true, null | GutterSize]
  | [false, string]

/**
 * @pure
 */
function parseGutter(gutter: mixed): GutterParseResult {
  switch(gutter) {
    case true:
      return [true, 'md']
    case false:
      return [true, null]
    case 'xs':
    case 'sm':
    case 'md':
    case 'lg':
    case 'xl':
      return [true, gutter]
    default:
      /**
       * parse custom value use "CSSStyleValue.parse"
       * only check at development mode
       */
      if('production' !== process.env.NODE_ENV) {
        declare var CSSStyleValue: any

        if(window.CSSStyleValue) {
          try {
            window.CSSStyleValue.parse('width', String(gutter))
          } catch(e) {
            throw new Error(e)
          }
        }
      }
      return [false, String(gutter)]
  }
}


/// export

export default parseGutter


/// test

import assert from 'assert'

describe('Function parseGutter()', () => {
  it('should parse style type', () => {
    assert.deepStrictEqual([true, 'xs'], parseGutter('xs'))
    assert.deepStrictEqual([true, 'sm'], parseGutter('sm'))
    assert.deepStrictEqual([true, 'md'], parseGutter('md'))
    assert.deepStrictEqual([true, 'lg'], parseGutter('lg'))
    assert.deepStrictEqual([true, 'xl'], parseGutter('xl'))
  })

  it('should parse boolean type', () => {
    assert.deepStrictEqual([true, 'md'], parseGutter(true))
    assert.deepStrictEqual([true, null], parseGutter(false))
  })

  it('should parse unknow string', () => {
    assert.deepStrictEqual([false, '2rem'], parseGutter('2rem'))
  })
})

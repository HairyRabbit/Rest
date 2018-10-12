/**
 * size-parser
 *
 * parse size value
 *
 * @flow
 */

import sizeRepeat from './size-repeat-resolver'
import style from './style.css'


/// code

function parseSize(size: ?string, max: number): Array<string | { flex: string }> {
  if(!size) return []

  /**
   * parse repeat pattern, should set env variable
   * "LAYOUT_SIZE_PATTERN_ENABLE" to non zero value
   */
  if(process.env.LAYOUT_SIZE_PATTERN_ENABLE &&
     "0" !== process.env.LAYOUT_SIZE_PATTERN_ENABLE) {
    return sizeRepeat(size, max).map(transform)
  }

  return size.split(':').map(transform)
}

function transform(value: string): string | { flex: string } {
  const num = Number(value)

  if(isNaN(num)) {
    if('auto' === value) return style.auto

    /**
     * check property "flex-basis" with "CSSStyleValue.parse"
     * only apply at development mode
     */
    if('production' !== process.env.NODE_ENV) {
      if(window.CSSStyleValue) {
        try {
          window.CSSStyleValue.parse('flex-basis', String(value))
        } catch(e) {
          throw new Error(e)
        }
      }
    }
    return { flex: `0 ${value}` }
  }

  switch(num) {
    case 0: return style.auto
    case 1: return style.grow
    default: {
      /**
       * check property "flex-grow" with "CSSStyleValue.parse"
       * only apply at development mode
       */
      if('production' !== process.env.NODE_ENV) {
        if(window.CSSStyleValue) {
          try {
            window.CSSStyleValue.parse('flex-grow', String(value))
          } catch(e) {
            throw new Error(e)
          }
        }
      }
      return { flex: value }
    }
  }
}



/// export

export default parseSize


/// test

import assert from 'assert'

describe('Component <Layout /> Function parseSize()', () => {
  style.grow = 'grow'
  style.auto = 'auto'

  describe(`Function transform()`, () => {
    it('should return "style.auto"', () => {
      assert.deepStrictEqual(style.auto, transform('auto'))
    })

    it('should return custom "flex-basis"', () => {
      assert.deepStrictEqual({ flex: '0 10rem' }, transform('10rem'))
    })

    it('should return buildin style', () => {
      assert.deepStrictEqual(style.auto, transform('0'))
      assert.deepStrictEqual(style.grow, transform('1'))
    })

    it('should return custom "flex-grow"', () => {
      assert.deepStrictEqual({ flex: '2' }, transform('2'))
    })
  })

  it('should return buildin style', () => {
    assert.deepStrictEqual([style.grow], parseSize('1', 1))
    assert.deepStrictEqual([style.auto], parseSize('0', 1))
  })

  it('should return custom flex-grow value', () => {
    assert.deepStrictEqual([{ flex: '2' }], parseSize('2', 1))
  })

  it('should return custom flex-auto value', () => {
    assert.deepStrictEqual([{ flex: '0 2rem' }], parseSize('2rem', 1))
  })
})

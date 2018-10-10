/**
 * size-parser
 *
 * parse size value
 *
 * @flow
 */

import style from './style.css'


/// code

function parseSize(size: ?string, max?: number): Array<string | { flex: string }> {
  if(!size) return []

  if(process.env.LAYOUT_SIZE_PATTERN_ENABLE &&
     "0" !== process.env.LAYOUT_SIZE_PATTERN_ENABLE) {
    return size.split(':')
  }

  return size.split(':').map(transform)
}

function transform(value: string): string | { flex: string } {
  const num = Number(value)

  if(isNaN(num)) {
    if('auto' === value) return style.basic
    return { flex: `0 ${value}` }
  }

  switch(num) {
    case 0: return style.basic
    case 1: return style.grow
    default: return { flex: `${num}` }
  }
}



/// export

export default parseSize


/// test

import assert from 'assert'

describe('Component <Layout /> Function parseSize()', () => {
  style.grow = 'grow'
  style.basic = 'basic'

  describe(`Function transform()`, () => {
    it('should return "style.basic"', () => {
      assert.deepStrictEqual(style.basic, transform('auto'))
    })

    it('should return custom "flex-basis"', () => {
      assert.deepStrictEqual({ flex: '0 10rem' }, transform('10rem'))
    })

    it('should return buildin style', () => {
      assert.deepStrictEqual(style.basic, transform('0'))
      assert.deepStrictEqual(style.grow, transform('1'))
    })

    it('should return custom "flex-grow"', () => {
      assert.deepStrictEqual({ flex: '2' }, transform('2'))
    })
  })

  it('should return buildin style', () => {
    assert.deepStrictEqual([style.grow], parseSize('1'))
    assert.deepStrictEqual([style.basic], parseSize('0'))
  })

  it('should return custom flex-grow value', () => {
    assert.deepStrictEqual([{ flex: '2' }], parseSize('2'))
  })

  it('should return custom flex-basic value', () => {
    assert.deepStrictEqual([{ flex: '0 2rem' }], parseSize('2rem'))
  })
})

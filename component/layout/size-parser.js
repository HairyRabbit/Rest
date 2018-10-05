/**
 * size-parser
 *
 * parse size value
 *
 * @flow
 */

import style from './style.css'


/// code

function parseSize(size: ?string): Array<string | { flex: string }> {
  if(!size) return []

  return size.split(':').map(s => {
    const n = Number(s)
    if(isNaN(n)) {
      if('auto' === s) return style.basic
      return { flex: `0 0 ${s}` }
    }

    switch(n) {
      case 0: return style.basic
      case 1: return style.grow
      default: return { flex: `${n} 0 auto` }
    }
  })
}


/// export

export default parseSize


/// test

import assert from 'assert'

describe('Component <Layout /> Function parseSize()', () => {
  style.grow = 'grow'
  style.basic = 'basic'

  it('should return buildin style', () => {
    assert.deepStrictEqual([style.grow], parseSize('1'))
    assert.deepStrictEqual([style.basic], parseSize('0'))
  })

  it('should return custom flex-grow value', () => {
    assert.deepStrictEqual([{ flex: '2 0 auto' }], parseSize('2'))
  })

  it('should return custom flex-basic value', () => {
    assert.deepStrictEqual([{ flex: '0 0 2rem' }], parseSize('2rem'))
  })
})

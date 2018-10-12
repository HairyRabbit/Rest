/**
 * size-repeat-resolver
 *
 * @flow
 */

import { flatMap } from 'lodash'


/// code

const re = /(?:^(\.{2,3})|(\.{2,3})$)/

function sizeRepeat(input: string, max: number): Array<string> {
  const sp = input.split(':')
  const len = sp.length

  if(len >= max) {
    const acc = []

    for(let i = 0; i < max; i++) {
      const item = sp[i]
      const ma = item.match(re)
      if(!ma) {
        acc.push(item)
      } else {
        const [ _, m1, m2 ] = ma
        acc.push(
          m1 && item.slice(m1.length) ||
            m2 && item.slice(0, -m2.length)
        )
      }
    }

    return acc
  } else {
    const acc = []
    let isRepeat = false

    for(let i = 0; i < len; i++) {
      const item = sp[i]
      const ma = item.match(re)
      let val, repeat = false, greedy = false

      if(!ma) {
        val = item
      } else {
        if(!isRepeat) isRepeat = true
        const [ _, m1, m2 ] = ma
        repeat = true
        greedy = (m1 || m2).length === 3
        val = m1 && item.slice(m1.length)
          || m2 && item.slice(0, -m2.length)
      }

      acc.push({ val, idx: i, repeat, greedy, span: 1 })
    }

    const arr = Array(max)

    if(!isRepeat) {
      const acclen = acc.length
      return Array.from(arr, (_, i) => acc[i % len].val)
    }

    const rest = max - len
    const rep = acc.filter(n => n.repeat).length
    const num = rest / rep
    const int = Math.floor(num)

    acc.forEach(r => {
      if(!r.repeat) return
      r.span = int + 1
    })

    if(0 !== num - int) {
      acc.sort((a, b) => Number(b.greedy) - Number(a.greedy))
      for(let i = 0; i < rest - rep * int; i++) {
        ++acc[i].span
      }
    }

    return flatMap(
      acc.sort((a, b) => a.idx - b.idx)
        .map(({ val, span }) => Array(span).fill(val))
    )
  }
}


/// export

export default sizeRepeat


/// test

import assert from 'assert'

describe('Component <Layout />, Function sizeRepeat()', () => {
  it('should return arr when length eq max', () => {
    assert.deepStrictEqual(['1','2','1'], sizeRepeat('1:2:1', 3))
  })

  it('should return arr when length ge max', () => {
    assert.deepStrictEqual(['1','2','3'], sizeRepeat('1:2:3:4', 3))
  })

  it('should return arr when length lt max, no repeat', () => {
    assert.deepStrictEqual(['1','2','3','1','2'], sizeRepeat('1:2:3', 5))
  })

  it('should return arr when length lt max, one repeat, two elements', () => {
    assert.deepStrictEqual(['1','1','1','1','2'], sizeRepeat('1..:2', 5))
  })

  it('should return arr when length lt max, one repeat, more elements', () => {
    assert.deepStrictEqual(['1','2','2','2','3'], sizeRepeat('1:2..:3', 5))
  })

  it('should return arr when length lt max, two repeats, two elements', () => {
    assert.deepStrictEqual(['1','1','1','2','2'], sizeRepeat('1..:2..', 5))
  })

  it('should return arr when length lt max, two repeats, two elements with greedy', () => {
    assert.deepStrictEqual(['1','1','2','2','2'], sizeRepeat('1..:2...', 5))
  })

  it('should return arr when length lt max, two repeats, more elements', () => {
    assert.deepStrictEqual(['1','1','2','3','3'], sizeRepeat('1..:2:3..', 5))
  })

  it('should return arr when length lt max, more repeats, more elements', () => {
    assert.deepStrictEqual(['1','1','2','2','3'], sizeRepeat('1..:2..:3..', 5))
  })

  it('should return arr when length lt max, complex', () => {
    assert.deepStrictEqual(['1','1','2','2','3','3','4'], sizeRepeat('1..:2..:3..:4..', 7))
  })

  it('should return arr when length lt max, complex 2', () => {
    assert.deepStrictEqual(['1','1','2','2','3','4','4'], sizeRepeat('1..:2..:3..:4...', 7))
  })

  it('should return arr when length lt max, complex 3', () => {
    assert.deepStrictEqual(['1','1','2','3','3','4','4'], sizeRepeat('1..:2..:3...:4...', 7))
  })

  it('should return arr when length lt max, complex 4', () => {
    assert.deepStrictEqual(['1','1','1','2','3','3','4'], sizeRepeat('1..:2:3..:4', 7))
  })

  it('should return arr when length lt max, complex 5', () => {
    assert.deepStrictEqual(['1','2','2','3','3','3','4'], sizeRepeat('1:2..:3...:4', 7))
  })

  it('should return arr when length lt max, valid syntax', () => {
    assert.deepStrictEqual(['1','1','1','1','2'], sizeRepeat('..1:2', 5))
  })
})

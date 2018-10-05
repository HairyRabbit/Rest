/**
 * grid-size-parser
 *
 * parse grid version size value
 *
 * @flow
 */

import { zipWith } from 'lodash'
import { classnames as cs } from '../../util'
import style from './style.css'
import grid from './grid.css'


/// code

type BreakPointsSize = {
  xs?: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
}

function parseGridSize(size: ?(string | BreakPointsSize), name?: string): Array<string> {
  if(!size) return []
  if('object' === typeof size) {
    const acc = []
    for(let name in size) {
      const value = size[name]
      const sizes = parseGridSize(value, 'default' === name ? undefined : name)
      acc.push(sizes)
    }

    return zipWith.apply(null, [...acc, cs])
  }

  return size.split(':').map(s => {
    const n = Number(s)
    if(isNaN(n)) {
      throw new Error(
        `Unknow grid value "${s}"`
      )
    }

    switch(n) {
      case 0:
        return style.grow
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return grid[`flex_g12_${s}${!name ? '' : '_' + name}`]
      default:
        throw new Error(
          `Unknow grid value "${s}"`
        )
    }
  })
}


/// export

export default parseGridSize


/// test

import assert from 'assert'

describe('Component <Layout /> Function parseSize()', () => {
  style.grow = 'grow'
  style.basic = 'basic'

  it('should return equal width', () => {
    assert.deepStrictEqual([style.grow], parseGridSize('0'))
  })

  it('should return grow value', () => {
    assert.deepStrictEqual([grid.flex_g12_1], parseGridSize('1'))
    assert.deepStrictEqual([grid.flex_g12_12], parseGridSize('12'))
  })
})

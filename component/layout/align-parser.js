/**
 * align-parser
 *
 * parse layout property "align" values, include "justify-content" 
 * and "align-items"
 *
 * @flow
 */

import { classnames as cs } from '../../util'
import style from './style.css'


/// code

type JustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'around'
  | 'between'

type AlignItems =
  | 'start'
  | 'end'
  | 'center'

function parseAlign(value: string): string {
  const [ justifyContent = '', alignItems = '' ] = value.split(',')
  
  return cs(
    parseJustifyContent(justifyContent.trim()),
    parseAlignItems(alignItems.trim())
  )
}

function parseJustifyContent(value: string): ?JustifyContent {
  switch(value) {
    case 'start':
    case 'end':
    case 'center':
    case 'round':
    case 'between':
      return style[`justifycontent_${value}`]
    default:
      return null
  }
}

function parseAlignItems(value: string): ?AlignItems {
  switch(value) {
    case 'start':
    case 'end':
    case 'center':
      return style[`alignitems_${value}`]
    default:
      return null
  }
}


/// export

export default parseAlign


/// test 

import assert from 'assert'

describe('Component <Layout /> Function parseAlign()', () => {
  style.justifycontent_start = style.alignitems_start = 'flex-start'
  
  it('should be justify-content value', () => {
    assert.deepStrictEqual('flex-start', parseAlign('start'))
  })

  it('should be align-items value', () => {
    assert.deepStrictEqual('flex-start', parseAlign(',start'))
  })

  it('should be both', () => {
    assert.deepStrictEqual('flex-start flex-start', parseAlign('start,start'))
  })

  it('should be blank string when parse failed', () => {
    assert.deepStrictEqual('', parseAlign('foo'))
    assert.deepStrictEqual('', parseAlign(',foo'))
    assert.deepStrictEqual('', parseAlign('foo,bar'))
  })
})
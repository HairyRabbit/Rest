/**
 * align-parser
 *
 * parse align value
 *
 * @flow
 */

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

type ParseResult = [?JustifyContent, ?AlignItems]

function parse(align: string): ParseResult {
  const [ justifyContent = '', alignItems = '' ] = align.split(',')
  return [
    parseJustifyContent(justifyContent.trim()),
    parseAlignItems(alignItems.trim())
  ]
}

function parseJustifyContent(align: string): ?JustifyContent {
  switch(align) {
    case 'start':
    case 'end':
    case 'center':
    case 'round':
    case 'between':
      return style[`justifycontent_${align}`]
    default:
      return null
  }
}

function parseAlignItems(align: string): ?AlignItems {
  switch(align) {
    case 'start':
    case 'end':
    case 'center':
      return style[`alignitems_${align}`]
    default:
      return null
  }
}


/// export

export default parse

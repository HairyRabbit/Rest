/**
 * <Layout />
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'
import { classnames as cs } from '../../util'


/// code

type GutterSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

type Props = {
  gutter?: boolean | GutterSize,
  vertical?: boolean,
  size?: string,
  clssName?: string,
  children?: React.Node
}

function Layout({ gutter = 'md', vertical = false, size, children, className, ...props }: Props = {}): React.Node {
  const gutterSize = parseGutter(gutter)
  const direction = vertical ? '_v' : ''
  const [ rowGutterClass, colGutterClass ] = [
    style[`row${direction}_${gutterSize}`],
    style[`col${direction}_${gutterSize}`]
  ]

  if(size) console.log(parseSize(size))

  return (
    <div className={cs(vertical ? style.vertical : style.base, rowGutterClass)}>
      {React.Children.toArray(children).map((child, idx) => (
        <div className={cs(colGutterClass, !size && style.mono)}
             style={size ? parseSize(size)[idx] : {}}
             key={idx}>
          {child}
        </div>
      ))}
    </div>
  )
}

/**
 * parse gutter value
 *
 * @pure
 */
function parseGutter(gutter: $PropertyType<Props, 'gutter'>): ?GutterSize {
  switch(gutter) {
    case true:
      return 'md'
    case false:
      return null
    case 'xs':
    case 'sm':
    case 'md':
    case 'lg':
    case 'xl':
      return gutter
    default:
      throw new Error(
        `Property gutter invalid: "${gutter}"`
      )
  }
}

/**
 * parse size value
 *
 * @pure
 */
function parseSize(size: string): Array<{ flex: string }> {
  return size.split(':').map(s => {
    const n = Number(s)
    if(!isNaN(n)) return { flex: `${n} 0 auto` }
    return { flex: `0 0 ${s}` }
  })
}


/// export

export default Layout


/// test

import assert from 'assert'

describe('Component <Layout />', () => {
  it('Function parseGutter(), style type', () => {
    assert.deepStrictEqual('md', parseGutter('md'))
    assert.deepStrictEqual('xl', parseGutter('xl'))
  })

  it('Function parseGutter(), boolean type', () => {
    assert.deepStrictEqual('md', parseGutter(true))
    assert.deepStrictEqual(null, parseGutter(false))
  })

  it('Function parseGutter(), throw when value invalid', () => {
    assert.throws(() => parseGutter('foo'), /Property gutter invalid/)
  })
})

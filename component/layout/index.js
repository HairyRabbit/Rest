/**
 * <Layout />
 *
 * follow bootstrap grid system
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'
import { classnames as cs } from '../../util'
import parseGutter, { type GutterSize } from './gutter-parser'
import parseAlign from './align-parser'
import computeStyle from './style-computer'


/// code

type Props = {
  gutter?: boolean | string | GutterSize,
  nogutter?: boolean,
  vertical?: boolean,
  align?: string,
  center?: boolean,
  size?: string,
  clssNames?: {
    row: string,
    col: Array<string>
  },
  styles?: {
    row?: Object,
    col?: Array<Object>
  },
  children?: React.Node,
  className?: string,
  style?: Object
}

function Layout({ gutter = 'md', nogutter = false, vertical = false, size, align, center, children, classNames = {}, styles = {}, className, style: cstyle, ...props }: Props = {}): React.Node {
  const [ gutterFlag, gutterSize ] = parseGutter(nogutter ? false : gutter)
  const [ rowGutter, colGutter ] = gutterFlag
        ? [
          style[`row${vertical ? '_v' : ''}_${gutterSize}`],
          style[`col${vertical ? '_v' : ''}_${gutterSize}`]
        ]
        : [
          !vertical
            ? computeStyle(gutterSize, true, 'marginLeft', 'marginRight')
            : computeStyle(gutterSize, true, 'marginTop', 'marginBottom'),
          !vertical
            ? computeStyle(gutterSize, false, 'paddingLeft', 'paddingRight')
            : computeStyle(gutterSize, false, 'paddingTop', 'paddingBottom')
        ]

  const rowClass = cs(
    vertical ? style.vertical : style.base,
    gutterFlag && rowGutter,
    center && cs.apply(null, parseAlign('center, center')),
    !center && align && cs.apply(null, parseAlign(align)),
    classNames.row,
    className
  )

  const rowStyle = {
    ...(!gutterFlag ? rowGutter : {}),
    ...styles.row,
    ...cstyle
  }

  const colClass = idx => cs(
    !size && style.mono,
    gutterFlag && colGutter,
    classNames.col && classNames.col[idx]
  )

  const colStyle = idx => ({
    ...(size ? parseSize(size)[idx] : {}),
    ...(!gutterFlag ? colGutter : {}),
    ...(styles.col && styles.col[idx] || {})
  })

  return (
    <div className={rowClass}
         style={rowStyle}
         {...props}>
      {React.Children.toArray(children).map((child, idx) => (
        <div className={colClass(idx)}
             style={colStyle(idx)}
             key={idx}>
          {child}
        </div>
      ))}
    </div>
  )
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
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

describe('Component <Layout />', () => {
  Enzyme.configure({ adapter: new Adapter() })

})

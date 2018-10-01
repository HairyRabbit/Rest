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
import prs, { type GutterSize } from './gutter-parser'
import tos from './style-computer'


/// code

type Props = {
  gutter?: boolean | string | GutterSize,
  nogutter?: boolean,
  vertical?: boolean,
  size?: string,
  clssNames?: {
    row: string,
    col: Array<string>
  },
  styles?: {
    row?: Object,
    col?: Array<Object>
  },
  children?: React.Node
}

function Layout({ gutter = 'md', nogutter = false, vertical = false, size, children, classNames = {}, styles = {}, ...props }: Props = {}): React.Node {
  const [ gutterFlag, gutterSize ] = prs(nogutter ? false : gutter)
  const [ rowGutter, colGutter ] = gutterFlag ? [
    style[`row${vertical ? '_v' : ''}_${gutterSize}`],
    style[`col${vertical ? '_v' : ''}_${gutterSize}`]
  ] : [
    !vertical
      ? tos(gutterSize, true, 'marginLeft', 'marginRight')
      : tos(gutterSize, true, 'marginTop', 'marginBottom'),
    !vertical
      ? tos(gutterSize, true, 'paddingLeft', 'paddingRight')
      : tos(gutterSize, true, 'paddingTop', 'paddingBottom')
  ]

  const rowClass = cs(
    vertical ? style.vertical : style.base,
    gutterFlag && rowGutter,
    classNames.row
  )

  const rowStyle = {
    ...(!gutterFlag ? rowGutter : {}),
    ...(styles.row || {})
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

/**
 * <Layout />
 *
 * follow bootstrap grid system
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'
import reset from '../../style/reset.css'
import { classnames as cs, makeWrapper } from '../../util'
import parseGutter from './gutter-parser'
import parseAlign from './align-parser'
import parseSize from './size-parser'
import parseGridSize from './grid-size-parser'
import computeStyle from './style-computer'


/// code

type Props = {
  gutter?: boolean | string,
  nogutter?: boolean,
  vertical?: boolean,
  reverse?: boolean,
  align?: string,
  center?: boolean,
  fill?: boolean,
  size?: string,
  auto?: boolean,
  list?: boolean,
  grid?: boolean | string,
  classNames?: {
    row?: string,
    col?: string
  },
  styles?: {
    row?: Object,
    col?: Object
  },
  tag?: string,
  tags?: {
    row?: 'string',
    col?: 'string'
  },
  wrapper?: React.ComponentType<*>,
  wrappers?: {
    row?: React.ComponentType<*>,
    col?: React.ComponentType<*>
  },
  children?: React.Node,
  className?: string,
  style?: Object
}

function Layout({ gutter,
                  nogutter,
                  reverse,
                  vertical,
                  size,
                  auto,
                  align,
                  center,
                  fill,
                  grid,
                  list,
                  children,
                  className,
                  classNames = {},
                  style: cstyle,
                  styles = {},
                  tag,
                  tags,
                  wrapper,
                  wrappers,
                  ...props }: Props = {}): React.Node {
  const child = React.Children.toArray(children)
  const [ gutterFlag, gutterSize ] = parseGutter(nogutter ? false : gutter || 'md')
  const [ rowGutter, colGutter ] = gutterFlag
        ? (gutterSize
           ? [
             style[`row${vertical ? '_v' : ''}_${gutterSize}`],
             style[`col${vertical ? '_v' : ''}_${gutterSize}`]
           ]
           : [])
        : (gutterSize
           ? [
             !vertical
               ? computeStyle(gutterSize, true, 'marginLeft', 'marginRight')
               : computeStyle(gutterSize, true, 'marginTop', 'marginBottom'),
             !vertical
               ? computeStyle(gutterSize, false, 'paddingLeft', 'paddingRight')
               : computeStyle(gutterSize, false, 'paddingTop', 'paddingBottom')
           ]
           : [])

  // if(process.env.LAYOUT_GRID)
  const sizes = grid ? parseGridSize(size) : parseSize(size)

  const rowClass = cs(
    vertical ? style.vertical : style.base,
    reverse && style.reverse,
    gutterFlag && rowGutter,
    center && parseAlign('center, center'),
    !center && align && parseAlign(align),
    fill && style.fill,
    list && reset.list,
    classNames.row,
    className
  )

  const rowStyle = {
    ...(!gutterFlag ? rowGutter : {}),
    ...styles.row,
    ...cstyle
  }

  const colClass = idx => cs(
    style.col,
    !size
      ? (1 === child.length
           ? style.basic
           : style.grow)
      : ('string' === typeof sizes[idx]
           ? sizes[idx]
           : null),
    gutterFlag && colGutter,
    classNames.col && classNames.col
  )

  const colStyle = idx => ({
    ...(size && 'string' !== typeof sizes[idx] ? sizes[idx] : {}),
    ...(!gutterFlag ? colGutter : {}),
    ...(styles.col && styles.col || {})
  })

  const [ RowWrapper, ColWrapper ] = list
        ? [makeWrapper('ul'), makeWrapper('li')]
        : wrappers
        ? [wrappers.row || makeWrapper(), wrappers.col || makeWrapper]
        : wrapper
        ? [wrapper || makeWrapper(), makeWrapper()]
        : tags
        ? [makeWrapper(tags.row), makeWrapper(tags.col)]
        : tag
        ? [makeWrapper(tag), makeWrapper()]
        : [makeWrapper(), makeWrapper()]

  return (
    <RowWrapper className={rowClass}
                style={rowStyle}
                {...props}>
      {child.map((child, idx) => (
        <ColWrapper className={colClass(idx % sizes.length)}
                    style={colStyle(idx % sizes.length)}
                    key={idx}>
          {child}
        </ColWrapper>
      ))}
    </RowWrapper>
  )
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

/**
 * <Layout />
 *
 * follow bootstrap grid system
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'
import { classnames as cs, makeWrapper } from '../../util'
import parseGutter from './gutter-parser'
import parseAlign from './align-parser'
import parseSize from './size-parser'
import computeStyle from './style-computer'


/// code

type Props = {
  gutter?: boolean | string,
  nogutter?: boolean,
  vertical?: boolean,
  align?: string,
  center?: boolean,
  size?: string,
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
                  vertical,
                  size,
                  align,
                  center,
                  children,
                  classNames = {},
                  styles = {},
                  className,
                  style: cstyle,
                  tag,
                  tags,
                  wrapper,
                  wrappers,
                  ...props }: Props = {}): React.Node {
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

  const sizes = parseSize(size)

  const rowClass = cs(
    vertical ? style.vertical : style.base,
    gutterFlag && rowGutter,
    center && parseAlign('center, center'),
    !center && align && parseAlign(align),
    classNames.row,
    className
  )

  const rowStyle = {
    ...(!gutterFlag ? rowGutter : {}),
    ...styles.row,
    ...cstyle
  }

  const colClass = idx => cs(
    !size ? style.grow : ('string' === typeof sizes[idx] ? sizes[idx] : null),
    gutterFlag && colGutter,
    classNames.col && classNames.col
  )

  const colStyle = idx => ({
    ...(size && 'string' !== typeof sizes[idx] ? sizes[idx] : {}),
    ...(!gutterFlag ? colGutter : {}),
    ...(styles.col && styles.col || {})
  })

  const [RowWrapper, ColWrapper] = wrappers
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
      {React.Children.toArray(children).map((child, idx) => (
        <ColWrapper className={colClass(idx)}
                    style={colStyle(idx)}
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

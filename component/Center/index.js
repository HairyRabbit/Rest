/**
 * <Center /> center view
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  tag?: string,
  className?: string,
  fill?: boolean,
  children?: React.Node
}

export default function Center({ fill, children, className, Tag = 'div', ...props }) {
  return (
    <Tag className={cs(style.main, fill && style.fill, className)} {...props}>
      {children}
    </Tag>
  )
}

/**
 * <Nav />
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import reset from '../../style/reset.css'
import style from './style.css'

/// code

export type Props = {
  children?: React.Node,
  classNames?: {
    list?: string,
    item?: string
  },
  className?: string,
  tags?: {
    list?: string,
    item?: string
  }
}

export default function Nav({ children, classNames = {}, className }: Props = {}): React.Node {
  return (
    <ul className={cs(reset.list, style.main, classNames.list, className)}>
      {React.Children.map(children, (child, idx) => (
        <li className={cs(style.item, classNames.item)} key={idx}>
          {child}
        </li>
      ))}
    </ul>
  )
}

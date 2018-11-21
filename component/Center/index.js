/**
 * <Center /> center view
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export default function Center({ children, className, Tag = 'div', ...props }) {
  return (
    <Tag className={cs(style.main, className)} {...props}>
      {children}
    </Tag>
  )
}

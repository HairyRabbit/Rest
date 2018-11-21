/**
 * <Card /> card view, for layout
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export default function Card({ children, className, ...props }) {
  return (
    <div className={cs(style.main, className)}>
      {children}
    </div>
  )
}

Card.Section = Section

export function Section({ children, className, ...props }) {
  return (
    <div className={cs(style.section, className)} {...props}>
      {children}
    </div>
  )
}

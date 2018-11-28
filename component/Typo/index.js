/**
 * <Typo /> used for style text color and size
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Theme = 'default' | 'primary' | 'info' | 'success' | 'error' | 'warning'

export type Props = {
  value?: string,
  size?: Size,
  theme?: Theme,
  color?: string,
  className?: string,
  style?: { [string]: string },
  children?: React.Node
}

export default function Typo({ value, size = 'md', theme, className, children, ...props }: Props = {}): React.Node {
  const classNames = cs(
    style[`size-${size}`],
    theme && style[`theme-${theme}`],
    className
  )

  return (
    <span className={classNames}>
      {value || children}
    </span>
  )
}

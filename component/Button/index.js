/**
 * <Button />
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  type?: 'button' | 'submit',
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  theme?: 'default' | 'primary' | 'secondary' | 'info' | 'error' | 'warning',
  surface?: 'outline' | 'flat' | 'text',
  className?: string,
  value?: string,
  children?: React.Node
}

export default function Button({ children, type = 'button', theme = 'primary', size='md', surface = 'flat', value, className, ...props }: Props = {}): React.Node {
  const containerClassName = cs(
    style.main,
    style.theme,
    style[`theme-${theme}`],
    style[`size-${size}`],
    style[`surface-${surface}`],
    className
  )
  return (
    <button className={containerClassName}
            type={type}
            {...props}>
      {value || children}
    </button>
  )
}

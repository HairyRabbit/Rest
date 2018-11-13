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
  theme?: 'default' | 'primary' | 'secondary' | 'info' | 'error' | 'warning',
  className?: string,
  children?: React.Node
}

export default function Button({ children, type = 'button', theme = 'primary', className, ...props }: Props = {}): React.Node {
  return (
    <button className={cs(style.main, style[`theme-${theme}`], className)}
            type={type}
            {...props}>
      {children}
    </button>
  )
}

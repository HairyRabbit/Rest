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
  className?: string,
  children?: React.Node
}

export default function Button({ children, type = 'button', className, ...props }: Props = {}): React.Node {
  return (
    <button className={cs(style.main, className)}
            type={type}
            {...props}>
      {children}
    </button>
  )
}

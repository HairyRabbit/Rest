/**
 * <TextField />
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  type?: 'text' | 'password',
  className?: string,
  value?: string,
  onChange?: Function
}

export default function TextField({ type = 'text', className, value, onChange, ...props }:Props = {}): React.Node {
  return (
    <input type={type}
           className={cs(style.main, className)}
           value={value}
           onChange={onChange}
           />
  )
}

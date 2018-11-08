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
  type?: 'text' | 'area' | 'password',
  className?: string,
  value?: string,
  onChange?: Function
} & AreaProps

export type AreaProps = {
  rows?: number
}

export default function TextField({ type = 'text', className, value, onChange, rows = 8, ...props }: Props = {}): React.Node {
  if('area' === type) return (
    <textarea className={cs(style.main, style.area, className)}
              value={value}
              rows={rows}
              onChange={onChange}></textarea>
  )

  return (
    <input type={type}
           className={cs(style.main, className)}
           value={value}
           onChange={onChange}
           />
  )
}

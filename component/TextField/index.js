/**
 * <TextField />
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs, randomString as rs } from '../../util'
import { Layout, Icon } from '../'
import style from './style.css'


/// code

export type Props = {
  name?: string,
  type?: 'text' | 'area' | 'password',
  autosize?: boolean,
  className?: string,
  value?: string,
  onChange?: Function
} & FieldProps & AreaProps

export type FieldProps = {

}

export type AreaProps = {
  rows?: number
}

export default function TextField({ name, type = 'text', className, autosize, value, onChange, rows = 8, ...props }: Props = {}): React.Node {
  const id = name || '__SWITCH_ID__' + rs()

  return 'area' === type ? (
    <textarea id={id} name={id}
              className={cs(style.main, style.area, className)}
              value={value}
              rows={rows}
              onChange={onChange}
              {...props}></textarea>
  ) : (
    <input id={id} name={id}
           type={type}
           className={cs(style.main, className)}
           value={value}
           onChange={onChange}
           size={true === autosize ? value.length : undefined}
           {...props}/>
  )
}

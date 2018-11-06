/**
 * <Switch />
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  name?: string,
  checked?: boolean,
  onChange?: Function,
  className?: string
}

export default function Switch({ name, checked, onChange, className, ...props }: Props = {}): React.Node {
  const state = checked ? 'on' : 'off'
  const id = name || '__SWITCH_ID__' + Math.random().toString(16).substr(2, 7)
  return (
    <label htmlFor={id} className={cs(style.main, style[state], className)} {...props}>
      <div className={style.container}>
        <div className={cs(style.cursor, style[state])}></div>
      </div>
      <input id={id} name={id}
             className={style.field}
             type="checkbox"
             checked={checked}
             onChange={onChange} />
    </label>
  )
}

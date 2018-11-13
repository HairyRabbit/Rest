/**
 * <CheckBox />, same as normal checkbox, but has three state:
 * true, false and undefined(unset)
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs, randomString as rs } from '../../util'
import style from './style.css'


/// code

type Checked = boolean | undefined

export type Props = {
  name?: string,
  checked?: Checked,
  onChange?: Function
}

export default function CheckBox({ name, checked, onChange, ...props }: Props = {}): React.Node {
  const id = name || '__SWITCH_ID__' + rs()
  return (
    <label htmlFor={id} className={cs(style.main, false !== checked && style.active)}>
      <span className={style.cursor}>
        {mapStateToCursor(checked)}
      </span>
      <input type="checkbox"
             id={id} name={id}
             checked={!!checked}
             onChange={onChange}
             className={style.field}
             {...props} />
    </label>
  )
}

function mapStateToCursor(checked: Checked): ?string {
  switch(checked) {
    case true: return '✓'
    case undefined: return '─'
    default: return null
  }
}


CheckBox.nextState = getNextState

function getNextState(current: Checked): Checked {
  switch(current) {
    case undefined: return true
    case true: return false
    case false: return undefined
    default: throw new Error(`Unknow checked value, "${current}"`)
  }
}

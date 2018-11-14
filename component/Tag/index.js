/**
 * <Tag />, tag component
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs } from '../../util'
import { TextField } from '../'
import style from './style.css'


/// code

export type Props = {
  closable?: boolean,
  onClose?: SyntheticEvent<HTMLDivElement> => void,
  editable?: boolean,
  onChange?: SyntheticEvent<HTMLInputElement> => void,
  className?: string,
  value?: string
}

export default function Tag({ closable, onClose, editable, onChange, value, className }: Props = {}): React.Node {
  const [isEdit, setIsEdit] = React.useState(false)
  const [editedValue, setEditedValue] = React.useState(value)
  const isControlled = isFunction(onChange)
  const containerClassName = cs(
    style.main,
    closable && style.closable,
    editable && isEdit && style.editable,
    className
  )
  return (
    <div className={containerClassName}
         onDoubleClick={handleMouseDoubleClick}>
      {editable && isEdit ? (
        <TextField value={editedValue}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   onKeyDown={handleKeyDown}
                   className={style.field}
                   autosize
                   autoFocus />
      ) : (
        <>
          {editedValue}
          {closable && (
            <div className={style.close}
                 onClick={onClose}>
              <Close className={style.icon} />
            </div>
          )}
        </>
      )}
    </div>
  )

  function handleChange(evt) {
    if(isControlled) {
      onChange(evt)
    } else {
      setEditedValue(evt.target.value)
    }
  }

  function handleBlur() {
    setIsEdit(false)
  }

  function handleKeyDown(evt) {
    if(13 !== evt.which) return
    evt.preventDefault()
    setIsEdit(false)
  }

  function handleMouseDoubleClick() {
    if(!editable) return
    setIsEdit(true)
  }
}

function Close(props): React.Node {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <path d="M56.843,56.843c3.373,-3.373 3.373,-8.85 0,-12.222l-37.464,-37.464c-3.372,-3.373 -8.849,-3.373 -12.222,0c-3.373,3.373 -3.373,8.85 0,12.222l37.464,37.464c3.372,3.373 8.849,3.373 12.222,0Z"/>
      <path d="M7.157,56.843c3.373,3.373 8.85,3.373 12.222,0l37.464,-37.464c3.373,-3.372 3.373,-8.849 0,-12.222c-3.373,-3.373 -8.85,-3.373 -12.222,0l-37.464,37.464c-3.373,3.372 -3.373,8.849 0,12.222Z"/>
    </svg>
  )
}

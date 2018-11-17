/**
 * <Tag />, tag component
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs, useProp } from '../../util'
import { TextField, Button } from '../'
import style from './style.css'


/// code

export type Props = {
  closable?: boolean,
  onClose?: SyntheticEvent<HTMLDivElement> => void,
  editable?: boolean,
  value?: string,
  onChange?: SyntheticEvent<HTMLInputElement> => void,
  isEdit?: boolean,
  onEditChange?: $PropertyType<Props, 'isEdit'> => void,
  onBlur?: SyntheticEvent<HTMLInputElement> => void,
  onKeyDown?: SyntheticEvent<HTMLInputElement> => void,
  onDoubleClick?: SyntheticEvent<HTMLButtonElement> => void,
  className?: string,
  classNames?: {
    [key: 'button' | 'input' | 'close']: string
  }
}

export default function Tag({ closable, onClose, editable, isEdit, onEditChange, value, onChange, onBlur, onKeyDown, onDoubleClick, className, classNames = {}, ...props }: Props = {}): React.Node {
  const [ _isEdit, setIsEdit ] = useProp(isEdit, onEditChange, false)
  const [ _value, setValue ] = useProp(value, onChange, '')
  const containerClassName = cs(
    style.main,
    closable && style.closable,
    editable && _isEdit && style.editable,
    className,
    classNames.button
  )
  return (
    <Button size="xs" className={containerClassName}
            onDoubleClick={handleMouseDoubleClick}>
      {editable && _isEdit ? (
        <TextField value={_value}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   onKeyDown={handleKeyDown}
                   className={style.field}
                   autosize
                   autoFocus
                   {...props} />
      ) : (
        <>
          {_value}
          {closable && (
            <div className={style.close}
                 onClick={onClose}>
              <Close className={style.icon} />
            </div>
          )}
        </>
      )}
    </Button>
  )

  function handleChange(evt) {
    const val = evt.target.value
    if(!val.trim()) isFunction(onClose) && onClose()
    setValue(evt)
  }

  function handleBlur(evt) {
    setIsEdit(false)
    isFunction(onBlur) && onBlur(evt)
  }

  function handleKeyDown(evt) {
    if(13 !== evt.which) return
    evt.preventDefault()
    setIsEdit(false)
    isFunction(onKeyDown) && onKeyDown(evt)
  }

  function handleMouseDoubleClick(evt) {
    if(!editable) return
    setIsEdit(true)
    isFunction(onDoubleClick) && onDoubleClick(evt)
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

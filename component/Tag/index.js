/**
 * <Tag />, tag component
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs, useProp } from '../../util'
import { TextField, Button, Close } from '../'
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
            onDoubleClick={handleMouseDoubleClick}
            {...props}>
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

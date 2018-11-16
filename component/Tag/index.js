/**
 * <Tag />, tag component
 *
 * @todo add "new" tag
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs } from '../../util'
import { TextField, Button } from '../'
import style from './style.css'


/// code

export type Props = {
  closable?: boolean,
  onClose?: SyntheticEvent<HTMLDivElement> => void,
  editable?: boolean,
  isEdit?: boolean,
  onChange?: SyntheticEvent<HTMLInputElement> => void,
  onEditChange?: $PropertyType<Props, 'isEdit'> => void,
  className?: string,
  value?: string,
  classNames?: {
    [key: 'button' | 'input' | 'close']: string
  }
}

export default function Tag(props: Props = {}): React.Node {
  return isFunction(props.onChange) && isFunction(props.onEditChange)
    ? <ControlledTag {...props} />
    : <UnControlledTag {...props} />
}

Tag.Controlled = ControlledTag
Tag.UnControlled = UnControlledTag

export function UnControlledTag({ closable, onClose, editable, isEdit = false, onChange, value, className, classNames = {}, ...props }: Props = {}): React.Node {
  const [ _isEdit, setIsEdit ] = React.useState(isEdit)
  const [ _value, setValue ] = React.useState(value)
  const containerClassName = cs(
    style.main,
    closable && style.closable,
    editable && _isEdit && style.editable,
    className,
    classNames.button
  )
  return (
    <Button size="sm" className={containerClassName}
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
    setValue(val)
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

export function ControlledTag({ closable, onClose, editable, isEdit = false, onChange, value, onEditChange, onBlur, onKeyDown, onDoubleClick, className, ...props }: Props = {}): React.Node {
  const containerClassName = cs(
    style.main,
    closable && style.closable,
    editable && isEdit && style.editable,
    className
  )
  return (
    <Button size="sm" className={containerClassName}
            onDoubleClick={handleMouseDoubleClick}>
      {editable && isEdit ? (
        <TextField value={value}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   onKeyDown={handleKeyDown}
                   className={style.field}
                   autosize
                   autoFocus
                   {...props} />
      ) : (
        <>
          {value}
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
    isFunction(onChange) && onChange(evt)
  }

  function handleBlur(evt) {
    onEditChange(false)
    isFunction(onBlur) && onBlur(evt)
  }

  function handleKeyDown(evt) {
    if(13 !== evt.which) return
    evt.preventDefault()
    onEditChange(false)
    isFunction(onKeyDown) && onKeyDown(evt)
  }

  function handleMouseDoubleClick(evt) {
    if(!editable) return
    onEditChange(true)
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

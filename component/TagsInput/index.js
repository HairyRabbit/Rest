/**
 * <TagInput /> input text field with tags
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs, randomString as rs } from '../../util'
import { TextField, Tag } from '../'
import reset from '../../style/reset.css'
import style from './style.css'


/// code

export type TagEntity = {
  id: string,
  value: string,
  isEdit: boolean
}

export type TagChangeAction = {
  type: 'create' | 'delete' | 'update',
  payload: {
    tag: TagEntity,
    index: number,
    _tag?: TagEntity
  }
}

export type Props = {
  tags?: Array<TagEntity>,
  whenblur?: 'push' | 'cancel' | boolean,
  value?: string,
  onChange?: SyntheticEvent<HTMLInputElement> => void,
  onTagsChange?: ($PropertyType<Props, 'tags'>, TagChangeAction) => void,
  onBlur?: SyntheticEvent<HTMLInputElement> => void,
}

export default function TagsInput({ tags = [], whenblur = true, value, onChange, onTagsChange, onBlur, ...props }: Props = {}): React.Node {
  const _whenblur = transformWhenBlur(whenblur)
  return (
    <div className={style.main}>
      {tags.length > 0 && (
        <ul className={cs(reset.list, style.list)}>
          {tags.map(({ id, value, isEdit }, idx) => (
            <li key={id} className={style.tag}>
              <Tag closable
                   editable
                   value={value}
                   isEdit={isEdit}
                   onClose={handleClose(idx)}
                   onChange={handleChange(idx)}
                   onEditChange={handleTagEditChange(idx)} />
            </li>
          ))}
        </ul>
      )}
      <TextField value={value}
                 onChange={onChange}
                 onKeyDown={handleKeyDown(onChange, tags, value, onTagsChange)}
                 className={style.field}
                 onBlur={handleBlur}
                 {...props} />
    </div>
  )

  function handleClose(idx) {
    return function handleClose1() {
      const tag = tags[idx]
      const left = tags.slice(0, idx)
      const right = tags.slice(idx + 1)
      onTagsChange && onTagsChange(
        left.concat(right), { type: 'delete', payload: { tag, index: idx } }
      )
    }
  }

  function handleChange(idx) {
    return function handleChange1(evt) {
      const _tag = tags[idx]
      const left = tags.slice(0, idx)
      const right = tags.slice(idx + 1)
      const tag = { ..._tag, value: evt.target.value.trim() }
      onTagsChange && onTagsChange(
        left.concat(tag, right), { type: 'update', payload: { tag, index: idx, _tag } }
      )
    }
  }

  function handleTagEditChange(idx) {
    return function handleTagEditChange1(isEdit) {
      const _tag = tags[idx]
      const left = tags.slice(0, idx)
      const right = tags.slice(idx + 1)
      const tag = { ..._tag, isEdit }
      onTagsChange && onTagsChange(
        left.concat(tag, right), { type: 'update', payload: { tag, index: idx, _tag } }
      )
    }
  }

  function handleBlur(evt) {
    let newTags = tags
    if(_whenblur) {
      const tag = {
        id: rs(),
        value: evt.target.value.trim(),
        isEdit: false
      }
      newTags = tags.concat(tag)
      isFunction(onTagsChange) && onTagsChange(
        newTags, { type: 'create', payload: { tag, index: -1 } }
      )
    }

    isFunction(onBlur) && onBlur(evt, newTags)
  }
}

function handleKeyDown(changeValue, tags, value, onTagsChange) {
  return function handleKeyDown1(evt) {
    if(9 === evt.which) {
      evt.preventDefault()
      const tag = {
        id: rs(),
        value: evt.target.value.trim(),
        isEdit: false
      }
      onTagsChange && onTagsChange(
        tags.concat(tag), { type: 'create', payload: { tag, index: -1 } }
      )
    } else if(8 === evt.which) {
      if(!tags.length || value) return
      evt.preventDefault()
      /**
       * empty tags list or blank text field value
       */
      const len = tags.length
      const lst = len - 1
      const tag = tags[lst]
      onTagsChange && onTagsChange(
        tags.slice(0, -1), { type: 'delete', payload: { tag, index: lst } }
      )
    } else {
      return
    }
  }
}

function transformWhenBlur(whenblur: $PropertyType<Props, 'whenblur'>): boolean {
  switch(whenblur) {
    case true:
    case 'push':
      return true
    case false:
    case 'cancle':
      return false
    default:
      throw new Error(`Unknow whenblur value, "${whenblur}"`)
  }
}

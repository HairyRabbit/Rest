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

export default function TagInput({ tags = [], value, onChange, onTagsChange, ...props }: Props = {}): React.Node {
  // const [ tagsState, setTagsState ] = React.useState(tags)

  return (
    <div className={style.main}>
      {tags.length > 0 && (
        <ul className={cs(reset.list, style.list)}>
          {tags.map((tag, idx) => (
            <li key={`${tag}-${idx}`} className={style.tag}>
              <Tag closable
                   editable
                   value={tag}
                   onClose={handleClose(idx)}
                   onChange={handleChange(idx)} />
            </li>
          ))}
        </ul>
      )}
      <TextField value={value}
                 onChange={onChange}
                 onKeyDown={handleKeyDown(onChange, tags, value, onTagsChange)}
                 className={style.field}
                 {...props} />
    </div>
  )

  function handleClose(idx) {
    return function handleClose1() {
      const tag = tags[idx]
      const left = tags.slice(0, idx)
      const right = tags.slice(idx + 1)
      onTagsChange && onTagsChange(
        left.concat(right), { type: 'remove', payload: { tag, index: idx } }
      )
    }
  }

  function handleChange(idx) {
    return function handleChange1(evt) {
      const _tag = tags[idx]
      const left = tags.slice(0, idx)
      const right = tags.slice(idx + 1)
      const tag = evt.target.value
      tags[idx] = tag
      onTagsChange && onTagsChange(
        tags, { type: 'update', payload: { tag, index: idx, _tag } }
      )
      // onTagsChange && onTagsChange(
      //   left.concat(tag, right), { type: 'update', payload: { tag, index: idx, _tag } }
      // )
    }
  }
}

function handleKeyDown(changeValue, tags, value, onTagsChange) {
  return function handleKeyDown1(evt) {
    if(9 === evt.which) {
      evt.preventDefault()
      const tag = evt.target.value
      // evt.target.value = ''
      // changeValue({ ...evt, target: { ...evt.target, value: '' }})
      onTagsChange && onTagsChange(
        tags.concat(value), { type: 'add', payload: { tag, index: -1 } }
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
        tags.slice(0, -1), { type: 'remove', payload: { tag, index: lst } }
      )
    } else {
      return
    }
  }
}

/**
 * <TagsGroup /> tags list group
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs, randomString as rs } from '../../util'
import { Layout, Tag } from '../'
import reset from '../../style/reset.css'
import style from './style.css'


/// code

export type Props = {
  tags: Array<string>
}

export default function TagsGroup({ tags = [], creator = 'new tag', onTagsChange, onCreatorChange }) {
  return (
    <Layout gutter="xs" size="0">
      {tags.length > 0 && (
        <Layout list gutter="xs" size="0">
          {tags.map(({ id, value, isEdit }, idx) => (
            <Tag closable
                 editable
                 key={id}
                 value={value}
                 isEdit={isEdit}
                 onClose={handleClose(idx)}
                 onChange={handleChange(idx)}
                 onEditChange={handleTagEditChange(idx)} />
          ))}
        </Layout>
      )}

      <Tag editable
           value={creator}
           className={style.new}
           onChange={handleCreatorChange}
           onEditChange={handleCreatorEditChange}/>
    </Layout>
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

  function handleCreatorChange() {

  }

  function handleCreatorEditChange() {

  }
}

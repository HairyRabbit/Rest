/**
 * <TagsGroup /> tags list group
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs, randomString as rs, useProp } from '../../util'
import { Layout, Tag } from '../'
import reset from '../../style/reset.css'
import style from './style.css'


/// code

export type Props = {
  tags?: Array<string>,
  active?: boolean,
  onToggleNew?: $PropertyType<Props, 'active'> => void,
  creator?: string,
  onCreatorChange?: SyntheticEvent<HTMLInputElement> => void,
  isCreatorEdit?: boolean,
  onCreatorEditChange?: $PropertyType<Props, 'isCreatorEdit'> => void
}

function getEventTargetValue(evt) {
  return evt.target.value
}


export default function TagsGroup({ tags = [], active, onToggleNew, creator, onTagsChange, isCreatorEdit, onCreatorChange, onCreatorEditChange, ...props }) {
  const [ _creator, setCreator, initCreator ] = useProp(creator, onCreatorChange, 'new tag', getEventTargetValue)
  const [ _isCreatorEdit, setIsCreatorEdit ] = useProp(isCreatorEdit, onCreatorEditChange, false)
  const [ _active, setActive ] = useProp(active, onToggleNew, false)

  return (
    <Layout gutter="xs" size="0" className={style.main}
            onMouseEnter={hoverSetActive(true)}
            onMouseLeave={hoverSetActive(false)}>
      {tags.length > 0 && (
        <Layout list gutter="xs" size="0">
          {tags.map(({ id, value, isEdit, ...rest }, idx) => (
            <Tag key={id} value={value} {...rest} />
          ))}
        </Layout>
      )}
      <Tag editable
           value={_creator}
           isEdit={_isCreatorEdit}
           className={cs(style.new, _active && style.active)}
           onChange={setCreator}
           onEditChange={handleCreatorEditChange} />
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

  function handleCreatorEditChange(state) {
    setIsCreatorEdit(state)
    if(state) {
      setCreator({ target: { value: '' }})
    } else {
      setCreator({ target: { value: initCreator.current }})
      const tag = {
        id: rs(),
        value: _creator.trim(),
        isEdit: false
      }

      // onTagsChange && onTagsChange(
      //   tags.concat(tag), { type: 'create', payload: { tag, index: -1 } }
      // )
    }
  }

  function hoverSetActive(state) {
    return function hoverSetActive() {
      setActive(state)
    }
  }
}

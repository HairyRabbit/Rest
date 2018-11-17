/**
 * <Tags />
 *
 * @flow
 */

import * as React from 'react'
import { connect } from 'react-redux'
import { TagsGroup } from '@component'
import { api, randomString as rs } from '@util'
import { parseImageRepoTag } from '../../util'
import { ActionType as DataActionType } from '../../core/image/data'
import { ActionType as PushTagActionType } from '../../core/image/pushTag'


/// code

export function Tags({ tags, id, repo, pushTag, creator, isCreatorEdit, setEdit, setValue, ...props }) {
  return (
    <TagsGroup tags={tags.map(parseImageRepoTag).map(normalizeTagState)}
               onTagsChange={requestPushTag(id, repo, pushTag)} />
  )
}

function normalizeTagState({ tag }, idx) {
  return {
    id: `Tag-${idx}`,
    value: tag,
    isEdit: false
  }
}


function requestPushTag(id: string, repo: string, pushTag: Function) {
  return function requestPushTag(tags, { type, payload: { tag: { value: tag }}}) {
    const _tag = tag.trim()
    if('create' === type && _tag) {
      api.post(`images/${id}/tag`, { params: { repo, tag: _tag }})
        .then(() => pushTag(`${repo}:${_tag}`))
    }
  }
}

function mapp(state) {
  return {
    ...state.ui.image.pushTag
  }
}

function mapd(dispatch) {
  return {
    pushTag(payload) {
      dispatch({ type: DataActionType.PushTag, payload })
    },
    setEdit(payload) {
      dispatch({ type: PushTagActionType.SetEdit, payload })
    },
    setValue(evt) {
      dispatch({ type: PushTagActionType.SetValue, payload: evt.target.value })
    }
  }
}

export default connect(mapp, mapd)(Tags)

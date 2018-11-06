/**
 * <SearchBar />
 *
 * @flow
 */

import * as React from 'react'
import { connect } from 'react-redux'
import style from './style.css'

/// code

export function SearchBar({ value, changeHandle }) {
  return (
    <input type="text"
           placeholder="type s"
           className={style.field}
           onChange={changeHandle}
           value={value} />
  )
}

function mapp(state) {
  return {
    value: state.ui.image
  }
}

function mapd(dispatch) {
  return {
    changeHandle: evt => {
      const value = evt.target.value
      dispatch({ type: 'ChangeValue', payload: value })
      dispatch({ type: 'FilterData', payload(data) {
        if(!value.trim()) return true
        const re = new RegExp(value)
        const { RepoTags } = data
        const [name, tag] = RepoTags && RepoTags.length
        ? RepoTags[0].split(':')
        : 'undefined:undefined'
        return re.test(name)
      } })
    }
  }
}

export default connect(mapp, mapd)(SearchBar)

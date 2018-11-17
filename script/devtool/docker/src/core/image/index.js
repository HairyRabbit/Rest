/**
 * image instance state reducer
 *
 * @flow
 */

import { combineReducers } from 'redux'
import data from './data'
import pushTag from './pushTag'


/// code

export default combineReducers({
  data,
  pushTag
})

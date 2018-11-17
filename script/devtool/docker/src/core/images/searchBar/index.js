/**
 * images searchbar reducer
 *
 * @flow
 */

import { combineReducers } from 'redux'
import queryParams from './queryParams'
import resultsFilter from './resultsFilter'


/// code

export default combineReducers({
  resultsFilter,
  queryParams
})

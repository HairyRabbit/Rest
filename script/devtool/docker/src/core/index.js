/**
 * store
 *
 * global redux store
 *
 * @flow
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'


/// code

const enhancer = 'production' !== process.env.NODE_ENV ?
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
       ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
       : compose)(
        applyMiddleware(
          //   createLogger({
          //     collapsed: true
          //   })
        )
      ) : applyMiddleware(

      )

function changeSearchBarValue(model = '', action) {
  switch(action.type) {
    case 'ChangeValue': {
      return action.payload
    }
    default: return model
  }
}

function imageData(model = { data: [], filter: []}, action) {
  switch(action.type) {
    case 'LoadData': {
      return {
        ...model,
        data: action.payload,
        filter: action.payload
      }
    }
    case 'FilterData': {
      return {
        ...model,
        filter: model.data.filter(action.payload)
      }
    }
    default: return model
  }
}

const initImageSearchBarQueryParamsModel = {
  all: false,
  digests: false,
  before: {
    tags: [],
    value: ''
  },
  reference: {
    tags: [],
    value: ''
  },
  since: {
    tags: [],
    value: ''
  },
  dangling: undefined,
  label: {
    tags: [],
    value: ''
  }
}

function imageSearchBarQueryParamsReducer(model = initImageSearchBarQueryParamsModel, action) {
  switch(action.type) {
    case 'SetValue':
      return {
        ...model,
        [action.payload.field]: action.payload.value
      }
    case 'ClearValues': {
      return initImageSearchBarQueryParamsModel
    }
    default: return model
  }
}

const reducer = combineReducers({
  ui: combineReducers({
    image: changeSearchBarValue,
    data: imageData,
    imageSearchBar: combineReducers({
      queryParams: imageSearchBarQueryParamsReducer
    })
  }),
  data: a => null,
  sesson: a => null
})

const init = {
  ui: {
    image: '',
    data: {
      data: [],
      filter: []
    },
    imageSearchBar: {
      queryParams: initImageSearchBarQueryParamsModel
    }
  },
  data: {},
  sesson: {}
}

export default createStore(reducer, init, enhancer)

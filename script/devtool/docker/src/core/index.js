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

import images from './images'
import image from './image'

const reducer = combineReducers({
  ui: combineReducers({
    images,
    image,
    data: imageData
  }),
  data: a => null,
  sesson: a => null
})

export default createStore(reducer, enhancer)

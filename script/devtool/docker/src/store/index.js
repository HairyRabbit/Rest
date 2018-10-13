/**
 * store
 *
 * global redux store
 *
 * @flow
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'


/// code

const enhancer = 'production' !== process.env.NODE_ENV
      ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
         ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
         : compose)(
        // applyMiddleware(
        //   createLogger({
        //     collapsed: true
        //   })
        // )
      )
      : applyMiddleware()

const reducer = combineReducers({
  ui: a => null,
  data: a => null,
  sesson: a => null
})

const init = {
  ui: {},
  data: {},
  sesson: {}
}

const store = createStore(reducer, init, enhancer)


/// export

export default store

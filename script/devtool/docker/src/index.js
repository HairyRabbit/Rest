/**
 * docker ui
 *
 * @flow
 */

import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
// import { hot } from 'react-hot-loader'
import './style.css'
import store from './core'
import Main from './Main'

function Root(): React.Node {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </Provider>
  )
}


export default Root
// export default hot(module)(Root)

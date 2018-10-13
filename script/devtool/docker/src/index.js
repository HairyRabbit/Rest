/**
 * docker ui
 *
 * @flow
 */

import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import './style.css'
import store from './store'
import Main from './main'

function Root(): React.Node {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </Provider>
  )
}


/// export

export default hot(module)(Root)

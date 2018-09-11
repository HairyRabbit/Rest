/**
 * website boot
 *
 * @flow
 */

import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import { hot } from 'react-hot-loader'
import '../style/main.css'
// import Avatar from './pages/components/avatar.md'
// import Builder from './pages/scripts/webpack.md'

const Avatar = Loadable({
  loader: () => import(
    /* webpackChunkName: "component-avatar" */
    './pages/components/avatar.md'
  ),
  loading: () => null
})

const Builder = Loadable({
  loader: () => import(
    /* webpackChunkName: "script-webpack" */
    './pages/scripts/webpack.md'
  ),
  loading: () => null
})


function Root(): React.Node {
  return (
    <Provider>
      <BrowserRouter>
        <Switch>
          <Route path="/avatar" component={Avatar} />
          <Route path="/scripts/webpack" component={Builder} />
          <Route component={Avatar} />
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}


/// export

export default hot(module)(Root)

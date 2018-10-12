/**
 * docker ui
 *
 * @flow
 */

import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'
import Loadable from 'react-loadable'
import { hot } from 'react-hot-loader'
import { Layout } from '~component'
import './style.css'
import Sidebar from './sidebar'
import Dashboard from './dashboard'

function Root(): React.Node {
  return (
    <Provider>
      <BrowserRouter>
        <Layout fill size="0:1">
          <Sidebar />

          <Switch>
            <Route component={Dashboard} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}


/// export

export default hot(module)(Root)

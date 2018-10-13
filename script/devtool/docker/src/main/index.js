/**
 * <Main />
 *
 * app main view
 *
 * @flow
 */

import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import { Layout } from '~component'
import style from './style.css'
import Sidebar from '../sidebar'
import Dashboard from '../dashboard'
import Container from '~/container'

function Main(): React.Node {
  return (
    <Layout fill size="0:1" tag="main">
      <Sidebar />

      <div className={style.main}>
        <Switch>
          <Route path="/" component={Dashboard} exact />
          <Route path="/container" component={Container} exact />
          <Route component={Dashboard} />
        </Switch>
      </div>
    </Layout>
  )
}


/// export

export default Main

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
import Sidebar from '../Sidebar'
import Dashboard from '../Dashboard'
import Images from '../Images'
import Image from '../Image'
import Containers from '../Containers'
import Container from '../Container'


function Main(): React.Node {
  return (
    <Layout fill size="0:1" tag="main">
      <Sidebar />

      <div className={style.main}>
        <Switch>
          <Route path="/" component={Dashboard} exact />
          <Route path="/image" component={Images} exact />
          <Route path="/image/:id" component={Image} exact />
          <Route path="/container" component={Containers} exact />
          <Route path="/container/:id" component={Container} exact />
          <Route component={Dashboard} />
        </Switch>
      </div>
    </Layout>
  )
}


/// export

export default Main

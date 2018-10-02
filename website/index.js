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
// import WebpackBuilder from './pages/scripts/webpack/builder.md'

const ComponentAvatar = Loadable({
  loader: () => import(
    /* webpackChunkName: "component-avatar" */
    './pages/components/avatar.md'
  ),
  loading: () => null
})

const ComponentLayout = Loadable({
  loader: () => import(
    /* webpackChunkName: "component-layout" */
    './pages/components/layout.md'
  ),
  loading: () => null
})

const WebpackBuilder = Loadable({
  loader: () => import(
    /* webpackChunkName: "webpack-builder" */
    './pages/scripts/webpack/builder.md'
  ),
  loading: () => null
})

import Graph from '~component/chart/graph'
import Title from '~component/chart/title'

const nodes = []
const links = []


const max = nodes.reduce((acc, curr) => acc + curr.value, 0)

const layout = {
  initLayout: 'circular',
  gravity: 0,
  repulsion: 100,
  edgeLength: 5
}

function mapValue(min, max, dmin, dmax, value) {
  return value / (dmax - dmin) * (max - min) + min
}

function mapSize(value) {
  if(value >= 1024000) {
    return mapValue(80, 100, 1024000, 1024000, value)
  } else if(value >= 300000) {
    return mapValue(50, 80, 300000, 1024000, value)
  } else if(value >= 100000) {
    return mapValue(30, 50, 100000, 300000, value)
  } else {
    return mapValue(5, 30, 0, 100000, value)
  }
}


const nodess = nodes.map(node => ({ ...node, symbolSize: mapSize(node.value), symbol: 'circle' }))

console.log(nodess, 42)

function Demo() {
  return (
    <Graph nodes={nodess}
           links={links}
           layout="force"
           roam={true}
           force={layout}
           draggable={true}
           lineStyle={{curveness: 0.3}}
           focusNodeAdjacency={true}>
      <Title text="foo" />
    </Graph>
  )
}

function Root(): React.Node {
  return (
    <Provider>
      <BrowserRouter>
        <Switch>
          <Route path="/component/avatar" component={ComponentAvatar} />
          <Route path="/component/layout" component={ComponentLayout} />
          <Route path="/webpack/builder" component={WebpackBuilder} />
          <Route component={Demo}/>
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}


/// export

export default hot(module)(Root)

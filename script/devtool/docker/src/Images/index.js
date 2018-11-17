/**
 * <Image />
 *
 * docker images view
 *
 * @flow
 */

import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, Layout, Switch, Button, TextField, FormItem } from '@component'
import { api, classnames as cs } from '@util'
import style from './style.css'
import UnNameIcon from '../../assets/icon/Layer.svg'
import NamedIcon from '../../assets/icon/Docker.svg'
import logos from '../../data/logo/logos.json'
import SearchBar from './SearchBar'
import DataList from './DataList'


/// code

function Header({ children, data, ...props }): React.Node {
  return (
    <h2 {...props} className={style.header}>
      {children} ({data.length})
    </h2>
  )
}

function ToolBar({ loadData }): React.Node {
  const [checked, setChecked] = React.useState(false)
  return (
    <div className={style.toolbar}>
      <SearchBar />
    </div>
  )
}

export function Images({ data = [], loadData, ...props }): React.Node {
  React.useEffect(fetchData(loadData), 0 === data.length)
  return (
    <Layout vertical>
      <Header data={data}>Docker Image</Header>
      <ToolBar loadData={loadData} {...props}/>
      <DataList data={data} />
    </Layout>
  )
}

function fetchData(loadData) {
  return function fetchData1() {
    api.get('images/json').then(loadData)
  }
}



/// export

function mapp(state) {
  return {
    data: state.ui.data
  }
}

function mapd(dispatch) {
  return {
    loadData: data => dispatch({ type: 'LoadData', payload: data })
  }
}

export default connect(mapp, mapd)(Images)
// export default Image

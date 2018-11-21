/**
 * <Log /> viw for container stdout logs, part of container
 *
 * @flow
 */

import * as React from 'react'
import { Layout, Icon, Switch } from '@component'
import * as docker from '../../service/api'
import style from './style.css'


/// code

export default function Log({ id }) {
  const [data, setData] = React.useState(null)
  React.useEffect(requestLogs(setData, id), null === data)
  console.log(data)

  return data && (
    <div className={style.main}>
      <header className={style.header}>
        <Layout align="between,center" size="0">
          <Layout size="0" gutter="xs" align=",center">
            <Icon value="Docker" />
            <span>container logs</span>
          </Layout>
          {id.substr(0, 7)}
          <Layout size="0" gutter="xs" align=",center">
            <span>Follow</span>
            <Switch name="follow" />
          </Layout>
        </Layout>
      </header>
      <pre className={style.text}>
        {data.split('\n').slice(0, -1).map(mapDataToCodeRowView)}
      </pre>
    </div>
  )
}

function requestLogs(setData, id) {
  return function requestLogs() {
    return docker.getContainerLogs(id).then(setData)
  }
}

function scrollToBottom(el) {
  el.scrollTo(0, el.scrollHeight)
}


function mapDataToCodeRowView(str, idx) {
  return (
    <div key={idx} className={style.row}>
      {/* <span className={style.linum}>{idx + 1}</span> */}
      {str.substr(8)}
    </div>
  )
}

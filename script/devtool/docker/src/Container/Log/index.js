/**
 * <Log /> viw for container stdout logs, part of container
 *
 * @flow
 */

import * as React from 'react'
import { Layout, Icon, Switch, ScrollView, ButtonGroup, Center, TextField } from '@component'
import * as docker from '../../service/api'
import style from './style.css'


/// code

export default function Log({ id }) {
  const [data, setData] = React.useState(null)
  const editorRef = React.useRef(null)
  const [cmd, setCmd] = React.useState('')
  React.useEffect(requestLogs(setData, id, editorRef), null === data)

  const stateGroup = [{
    value: 'all',
    checked: true
  },{
    value: 'stdout',
    checked: false
  },{
    value: 'stderr',
    checked: false
  }]

  return data && (
    <div className={style.main}>
      <header className={style.header}>
        <Layout align="between,center">
          <Layout size="0" gutter="xs" align=",center">
            <Icon value="Docker" />
            <span>container logs - {id.substr(0, 7)}</span>
          </Layout>
          <Center>
            <ButtonGroup value={stateGroup} size="sm" className={style.buttons} />
          </Center>
          <Layout size="0" gutter="xs" align=",center">
            <span>Follow</span>
            <Switch name="follow" />
          </Layout>
        </Layout>
      </header>
      <ScrollView always="bottom">
        <div className={style.text} ref={editorRef}>
          {data.map(mapDataToCodeRowView)}
        </div>
      </ScrollView>
      <Layout vertical nogutter>
        <footer className={style.footer}>
          SCROLL 42%
        </footer>
        <Layout nogutter align=",center" size="0:1">
          <span className={style.prompt}>&gt;</span>
          <TextField className={style.field}
                     value={cmd}
                     onChange={evt => setCmd(evt.target.value)}
                     onKeyDown={postCmd(id, setData, editorRef, setCmd)}
                     placeholder="send commands to 'docker exec', e.g `echo 42`" />
        </Layout>
      </Layout>
    </div>
  )
}

function postCmd(id, setData, editorRef, setCmd) {
  return function postCmd(evt) {
    if(13 !== evt.which) return
    docker.createContainerExec(id, {
      Cmd: evt.target.value.split(' ')
    }).then(({ Id }) => docker.startExec(Id))
      .then(data => setData(prevData => prevData.concat(
        data.substr(8).split('\n')
      )))
      .then(() => {
        scrollToBottom(editorRef)
        setCmd('')
      })
  }
}

// docker.createContainerExec(id, {
//   Cmd: 'echo `whoami`@$HOSTNAME:$PWD'
// })

function requestLogs(setData, id, editorRef) {
  return function requestLogs() {
    return docker.getContainerLogs(id)
      .then(data => data.split('\n').slice(0, -1).map(s => s.substr(8)))
      .then(setData)
      .then(() => scrollToBottom(editorRef))
  }
}

function scrollToBottom(el) {
  console.log(el)
  el.current.scrollTo(0, el.current.scrollHeight)
}


function mapDataToCodeRowView(str, idx) {
  return (
    <pre key={idx} className={style.row}>
      {/* <span className={style.linum}>{idx + 1}</span> */}
      {str}
    </pre>
  )
}

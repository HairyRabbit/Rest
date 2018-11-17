/**
 * <Image />
 *
 * docker images view
 *
 * @flow
 */

import * as React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Avatar, Layout, Button, TextField, Table, Icon } from '@component'
import { api, classnames as cs, toDateAgo, toShortSize } from '@util'
import { parseImageRepoTag, parseImageId } from '../util'
import style from './style.css'
import { ActionType } from '../core/image/data'
import logos from '../../data/logo/logos.json'
import Tags from './Tags'


/// code

function Display({ Id, RepoTags, pushTag }): React.Node {
  const { repo } = parseImageRepoTag(RepoTags[0])
  const { id, short } = parseImageId(Id)

  return (
    <div className={style.main}>
      <Layout vertical>
        <Layout size="0:1">
          <Icon value="Layer" className={style.icon} />
          <Layout vertical gutter="sm">
            <Layout vertical nogutter>
              <h2 className={style.header}>{repo}</h2>
              <div className={style.small}>{short}</div>
            </Layout>
            <Tags id={id} repo={repo} tags={RepoTags} />
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

function DataView({ Id, Architecture, Os, DockerVersion, Created, Size, VirtualSize }) {
  return (
    <div className={style.main}>
      <Layout vertical gutter="xs">
        <Layout size="16.6667%:1">
          <div>System Infomation</div>
          <div>{Os} {Architecture}</div>
        </Layout>
        <Layout size="16.6667%:1">
          <div>Docker Version</div>
          <div>{DockerVersion}</div>
        </Layout>
        <Layout size="16.6667%:1">
          <div>Create at</div>
          <div>{toDateAgo(new Date(Created))}</div>
        </Layout>
        <Layout size="16.6667%:1">
          <div>Size</div>
          <div>{toShortSize(Size)}</div>
        </Layout>
      </Layout>
    </div>
  )
}

function ToolBar() {
  return (
    <div>
      <Button>History</Button>
      <Button>Push</Button>
      <Button>Delete</Button>
      <Button>Export</Button>
    </div>
  )
}


function VerticalLine({ Parent }) {
  const [data, setData] = React.useState([])
  React.useEffect(() => {
    if(Parent) requestParentRecursive(Parent).then(setData)
  }, data.length)
  console.log(data)
  return data.length > 0 && (
    data.map(({ Id, ContainerConfig: { Cmd = [] } = {} }, idx) => (
      <div key={idx}>{Cmd.join(' ')}</div>
    ))
  )
}

function requestParentRecursive(id) {
  const acc = []
  function recur(id, res) {
    return api.get(`images/${id}/json`).then(data => {
      acc.push(data)
      if(!data.Parent) return res(acc)
      return recur(data.Parent, res)
    }).catch(() => res(acc))
  }

  return new Promise((res) => {
    recur(id, res)
  })
}

function History({ id }) {
  const [data, setData] = React.useState([])
  React.useEffect(getHistory, data.length)
  console.log(data)
  return data.length > 0 && (
    <div className={cs(style.main, style.table)}>
      <Table value={data.map(({ Id, Comment, Created, CreatedBy, Size, Tags }) => ({
        id: '<missing>' === Id ? 'Missing' : parseImageId(Id).shorter,
        cmd: CreatedBy.substr(0, 50),
        size: toShortSize(Size),
        created: toDateAgo(Created * 1000)
      }))}>
        <Table.Col value="id">Image ID</Table.Col>
        <Table.Col value="cmd">Command</Table.Col>
        <Table.Col value="size">Size</Table.Col>
        <Table.Col value="created">Created</Table.Col>
      </Table>
    </div>
  )

  function getHistory() {
    api.get(`images/${id}/history`).then(setData)
  }
}

function Highlight({ children }) {
  // const sh = require('mvdan-sh')
  // const syntax = sh.syntax

  // var parser = syntax.NewParser()
  // var printer = syntax.NewPrinter()

  // var src = children
  // var f = parser.Parse(src, "src.sh")
  // console.log(printer.Print(f))
  const str = children
        .replace(/\s+(&{1,2})\s+/g, '\n\t$1 ')
        .replace(/     /g, '\n\t')
        .replace(/ > /g, '\n\t > ')
        .replace(/ >> /g, '\n\t > ')
        .replace(/(\w{32,})/g, (_, id) => id.substr(0, 7))
  return <pre>{str}</pre>
}

export function Image({ data, match, loadData, pushTag, ...props }): React.Node {
  const id = match.params.id
  React.useEffect(requestData(id, loadData), data)
  console.log(data)
  return data && (
    <Layout vertical>
      <Display {...data} pushTag={pushTag} />
      <DataView {...data} />
      <ToolBar />
      <History id={id} />
    </Layout>
  )
}

function requestData(id, loadData) {
  return function requestData1() {
    api.get(`images/${id}/json`)
      .then(loadData)
  }
}

function requestPushTag(id: string, repo: string, pushTag: Function) {
  return function requestPushTag(tags, { type, payload: { tag: { value: tag }}}) {
    const _tag = tag.trim()
    if('create' === type && _tag) {
      api.post(`images/${id}/tag`, { params: { repo, _tag }})
        .then(() => pushTag(`${repo}:${_tag}`))
    }
  }
}

function deleteTag(id: string, repo: string, tag: string) {
  return function deleteTag() {
    // docker rmi repo:tag
  }
}



/// export

function mapp(state) {
  return {
    data: state.ui.image.data
  }
}

function mapd(dispatch) {
  return {
    loadData: payload => dispatch({ type: ActionType.LoadData, payload }),
    pushTag: payload => dispatch({ type: ActionType.PushTag, payload })
  }
}

export default withRouter(connect(mapp, mapd)(Image))
// export default Image

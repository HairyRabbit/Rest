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
import { Avatar, Layout, withMount } from '~component'
import { classnames as cs } from '~util'
import style from './style.css'
import UnNameIcon from '../../assets/icon/Layer.svg'
import NamedIcon from '../../assets/icon/Docker.svg'
import logos from '../../data/logo/logos.json'


/// code

function transformDockerImageId(input: string, { length = 20 }: Object = {}): string {
  return input.split(':')[1].substr(0, 20)
}

function transformSize(input: string, { digits = 2 }: Object = {}): string {
  const byteStack = ['B', 'KB', 'MB', 'MB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let num = parseInt(input)
  let unit = byteStack.shift()
  let flag = 1000
  while(num >= flag) {
    num = num / flag
    unit = byteStack.shift()
    flag = 1024
  }

  if('B' === unit) {
    return num + ' ' + unit
  }

  return num.toFixed(digits) + ' ' + unit
}

function transformDateAgo(input: number): string {
  const comp = [
    [31536e6, 'year'],
    [2592e6, 'month'],
    [6048e5, 'week'],
    [864e5, 'day'],
    [36e5, 'hour'],
    [6e4, 'min'],
    [1e3, 'sec']
  ]
  const now = Date.now()
  const diff = now - input * 1000

  for(let i = 0; i < comp.length; i++) {
    const item = comp[i]
    if(diff / item[0] > 1) {
      const num = parseInt(diff / item[0])
      return `${num} ${item[1]}${num > 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

function isUnname(input): boolean {
  return '<none>' === input
}

function transformDockerImageTag(input: string): string {
  if(isUnname(input)) return 'none'
  return input
}

function transformDockerImageName(input: string): string {
  if(isUnname(input)) return 'Unknow'
  return input
}


function Header({ children, data, ...props }): React.Node {
  return (
    <h2 {...props} className={style.header}>
      {children} ({data.length})
    </h2>
  )
}

function List({ data }): React.Node {
  return (
    <Layout list size="33.3333%">
      {data.length && data.map((item, idx) => (
        <Item {...item} key={idx} />
      ))}
    </Layout>
  )
}

function findLogo(target) {
  const str = target.trim()
  const logo = logos.find(
    ({ name, shortname }) =>
      // ~target.indexOf(name) || ~target.indexOf(shortname)
      // new RegExp(`^(${name}|${shortname})|(${name}|${shortname})$`).test(target)
      str === name || str === shortname
  )
  if(!logo) return undefined
  return logo.files[0]
}

function Logo({ data }): React.Node {
  if(isUnname(data)) return (<NamedIcon className={style.icon} />)
  const findName = data.split('/').map(findLogo).reverse().find(Boolean)
  if(!findName) return (<NamedIcon className={cs(style.icon, style.custom)} />)
  const LogoIcon = require(`../../data/logo/${findName}`).default
  return (<LogoIcon className={style.icon} />)
}


function Item({ Id, ParentId, Size, VirtualSize, SharedSize, Created, RepoTags, Containers }): React.Node {
  const [name, tag] = RepoTags && RepoTags.length
        ? RepoTags[0].split(':')
        : 'undefined:undefined'
  const createAt = transformDateAgo(Created)

  return (
    <div className={style.main}>
      <Layout vertical gutter="xs">
        <Link to={`/image/${Id}`} className={style.name}>
          {transformDockerImageName(name)}
          <div className={style.id}>
            {transformDockerImageId(Id)}
          </div>
        </Link>

        <Layout size="0:1:0" gutter="xs" align=",center">
          <Logo data={name} />
          <span className={style.size}>
            {transformSize(Size)}
          </span>
          <span className={style.date}>
            {createAt}
          </span>
        </Layout>

        <div className={style.tag}>
          Tag: {transformDockerImageTag(tag)}
        </div>
      </Layout>
    </div>
  )
}

function ToolBar() {
  return (
    <div className={style.toolbar}>
      <input type="text" placeholder="type s" />
    </div>
  )
}


function Image(): React.Node {
  const [data, setData] = React.useState([])
  React.useEffect(() => {
    fetch('/api/images/json')
      .then(res => res.json())
      .then(setData)
  }, data.length)

  return (
    <Layout vertical>
      <Header data={data}>Docker Image</Header>
      <ToolBar />
      <List data={data} />
    </Layout>
  )
}


/// export

// export default connect(mapp, mapd)(withMount(mount)(Image))
export default Image

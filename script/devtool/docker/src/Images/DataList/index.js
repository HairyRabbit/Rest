/**
 * <DataList />
 *
 * @flow
 */

import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Layout, Tag, CollectView } from '@component'
import { classnames as cs, toShortSize, toDateAgo } from '@util'
import style from './style.css'
import UnNameIcon from '../../../assets/icon/Layer.svg'
import NamedIcon from '../../../assets/icon/Docker.svg'
import logos from '../../../data/logo/logos.json'


/// code

function transformDockerImageId(input: string, { length = 20 }: Object = {}): string {
  return input.split(':')[1].substr(0, 20)
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
  const LogoIcon = require(`../../../data/logo/${findName}`).default
  return (<LogoIcon className={style.icon} />)
}


function Item({ Id, ParentId, Size, VirtualSize, SharedSize, Created, RepoTags, Containers }): React.Node {
  const [name, tag] = RepoTags && RepoTags.length
        ? RepoTags[0].split(':')
        : 'undefined:undefined'
  const createAt = toDateAgo(Created)

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
            {toShortSize(Size)}
          </span>
          <span className={style.date}>
            {createAt}
          </span>
        </Layout>

        <div className={style.tag}>
          Tag: <Tag editable value={transformDockerImageTag(tag)} />
        </div>
      </Layout>
    </div>
  )
}

export function DataList({ data }): React.Node {
  return (
    <Layout list size="33.3333%">
      {data.length > 0 && data.map((item, idx) => (
        <Item {...item} key={idx} />
      ))}
    </Layout>
  )
}

function mapp(store) {
  return {
    data: store.ui.data.filter
  }
}

function mapd(dispatch) {
  return {}
}

export default connect(mapp, mapd)(DataList)

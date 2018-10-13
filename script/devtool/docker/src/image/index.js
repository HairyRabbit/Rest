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
import { Layout, withMount } from '~component'
import { toISODate } from '~util'
import style from './style.css'


/// code

const data = [
  {
    "Id": "sha256:e216a057b1cb1efc11f8a268f37ef62083e70b1b38323ba252e25ac88904a7e8",
    "ParentId": "",
    "RepoTags": [
      "ubuntu:12.04",
      "ubuntu:precise"
    ],
    "RepoDigests": [
      "ubuntu@sha256:992069aee4016783df6345315302fa59681aae51a8eeb2f889dea59290f21787"
    ],
    "Created": 1474925151,
    "Size": 103579269,
    "VirtualSize": 103579269,
    "SharedSize": 0,
    "Labels": {},
    "Containers": 2
  },
  {
    "Id": "sha256:3e314f95dcace0f5e4fd37b10862fe8398e3c60ed36600bc0ca5fda78b087175",
    "ParentId": "",
    "RepoTags": [
      "ubuntu:12.10",
      "ubuntu:quantal"
    ],
    "RepoDigests": [
      "ubuntu@sha256:002fba3e3255af10be97ea26e476692a7ebed0bb074a9ab960b2e7a1526b15d7",
      "ubuntu@sha256:68ea0200f0b90df725d99d823905b04cf844f6039ef60c60bf3e019915017bd3"
    ],
    "Created": 1403128455,
    "Size": 172064416,
    "VirtualSize": 172064416,
    "SharedSize": 0,
    "Labels": {},
    "Containers": 5
  }
]

function Image(): React.Node {
  return (
    <Layout vertical>
      <Header>IMAGE</Header>

      <List />
    </Layout>
  )
}

function Header({ children, ...props }): React.Node {
  return (
    <h2 {...props} className={style.header}>
      {children}
    </h2>
  )
}

function List(): React.Node {
  return (
    <Layout list size="33.3333%">
      {data.map((item, idx) => (
        <Item {...item} key={idx} />
      ))}
    </Layout>
  )
}

function Item({ idx,
                Id,
                ParentId,
                Size,
                VirtualSize,
                SharedSize,
                Created,
                RepoTags,
                Containers }): React.Node {
  const name = RepoTags[0].split(':')[0]
  const createAt = toISODate(new Date(Created * 1000))

  return (
    <div className={style.main}>
      <Layout vertical className={style.card}>
        <Layout size="0:1:0">
          <Layout center className={style.avatar}>
            {name.substr(0, 1)}
          </Layout>
          <Link to={`/image/${Id}`} className={style.name}>
            {name}
          </Link>
          <div className={style.date}>
            {createAt}
          </div>
        </Layout>

        <div className={style.date}>
          Containers Number: {Containers}
        </div>

        <div className={style.date}>
          <div>Size: {Size}</div>
          <div>Virtual Size: {VirtualSize}</div>
          <div>Shared Size: {SharedSize}</div>
        </div>

        <div className={style.date}>
          <div>Repo Tags:</div>
          {RepoTags.map((tag, idx) => (<div key={idx}>{tag}</div>))}
        </div>
      </Layout>
    </div>
  )
}


/// hoc:connect

function mapp(state) {
  return {}
}

function mapd(dispatch) {
  return {}
}


/// hoc:withMount

function mount() {
  fetch('/api/images/json')
    .then(res => res.json()).then(console.log)
}


/// export

export default connect(mapp, mapd)(withMount(mount)(Image))

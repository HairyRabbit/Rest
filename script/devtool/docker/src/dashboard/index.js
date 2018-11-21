/**
 * <Dashboard />
 *
 * docker ui dashboard container
 *
 * @flow
 */

import * as React from 'react'
import { Layout, Icon } from '@component'
import { toDateAgo } from '@util'
import * as docker from '../service/api'
import style from './style.css'
import Version from './Version'
import Containers from './Containers'


/// code

export default function Dashboard() {
  const [ data, setData ] = React.useState(null)
  React.useEffect(requestData, null === data)
  console.log(data)
  return data && (
    <div className={style.main}>
      <Layout vertical>
        <Layout>
          <CardView icon="Container" label="Containers">
            <span className={style.number}>
              {data[0].Containers.filter(({ State }) => 'running' === State).length}
            </span>
            <span className={style.div}>
              <svg viewBox="0 0 64 64">
                <line x1="8" y1="64" x2="56" y2="0" stroke="black" />
              </svg>
            </span>
            <span className={style.smallNumber}>
              {data[0].Containers.length}
            </span>
          </CardView>

          <CardView icon="Layer" label="Images">
            <span className={style.number}>
              {data[0].Images.length}
            </span>
          </CardView>

          <CardView icon="Container" label="Volumes">
            <span className={style.number}>
              {data[0].Volumes.length}
            </span>
          </CardView>

          <CardView icon="Container" label="Networks">
            <span className={style.number}>
              {data[1].length}
            </span>
          </CardView>
        </Layout>

        <Layout size="1:0">
          <Containers
            Containers={data[0].Containers}
            ContainersPaused={data[3].ContainersPaused}
            ContainersRunning={data[3].ContainersRunning}
            ContainersStopped={data[3].ContainersStopped} />
          <Version {...data[2]} />
        </Layout>
      </Layout>
    </div>
  )

  function requestData() {
    return Promise.all([
      docker.getData(),
      docker.getNetworks(),
      docker.getVersion(),
      docker.getInfo()
    ]).then(setData)
  }
}

type CardViewProps = {
  icon?: string,
  label?: string,
  children?: React.Node
}

function CardView({ icon, children, label }: CardViewProps = {}): React.Node {
  return (
    <div className={style.card}>
      <Layout vertical align=",center" gutter="sm">
        <div className={style.icon}>
          <Icon value={icon} />
        </div>
        <div className={style.numbers}>
          {children}
        </div>
        <div className={style.text}>{label}</div>
      </Layout>
    </div>
  )
}

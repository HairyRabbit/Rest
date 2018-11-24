/**
 * <Info /> view, part of <Container />
 *
 * @flow
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import { Layout,
         Center,
         Icon,
         IconButton,
         Button,
         Tag,
         Typo,
         Modal,
         Collapse,
         CollapseGroup } from '@component'
import { toDateAgo } from '@util'
import { transformDockerContainerId,
         transformDockerContainerName,
         parseImageId,
         transformDockerContainerPorts,
         transformDockerContainerVolumes,
         transformDockerContainerNetWorks } from '../../util'
import reset from '@style/reset.css'
import style from './style.css'
import Image from './Image'


/// code

export default function Info({ Id, Created, Name, Image, Config, State, NetworkSettings }) {
  return (
    <header className={style.main}>
      <Layout vertical>
        <Layout align="between,center" size="1:0">
          <Layout size="0:1">
            <Center fill>
              <Icon size="xl" value="box" />
            </Center>
            <Layout vertical nogutter>
              <Layout size="0" align=",center">
                <Typo size="xl">{transformDockerContainerName(Name)}</Typo>
                <Tag theme={mapContainerStatusToTheme(State.Status)}
                     surface="outline"
                     value={State.Status}/>
              </Layout>
              <Layout size="0">
                <Typo size="xs" value={`ID: ${transformDockerContainerId(Id)}`} />
                <Typo size="xs" value={`Create at: ${toDateAgo(new Date(Created))}`} />
              </Layout>
            </Layout>
          </Layout>
          <Operation {...State} />
        </Layout>

        <ImageSection id={Image} name={Config.Image}
                      ports={Config.ExposedPorts}
                      hostname={Config.Hostname}
                      user={Config.User}
                      cwd={Config.WorkingDir}
                      volumes={Config.Volumes}
                      networks={NetworkSettings.Networks} />
      </Layout>
    </header>
  )
}

function ImageSection({ id, name, ports, hostname, user, cwd, volumes, networks }) {
  return (
    <CollapseGroup>
      <Collapse summary="> Image Infomation" active>
        <div className={style.section}>
          <Image id={id} name={name} />
        </div>
      </Collapse>
      <Collapse summary="> Hostname & Port">
        <HostnamePort hostname={hostname}
                      ports={ports}
                      user={user}
                      cwd={cwd} />
      </Collapse>
      <Collapse summary="> Volumns">
        <Volumes volumes={volumes} />
      </Collapse>
      <Collapse summary="> Networks">
        <Networks networks={networks} />
      </Collapse>
    </CollapseGroup>
  )
}

function HostnamePort({ ports, hostname, user, cwd }) {
  return (
    <Layout vertical>
      <div>User/Hostname:WorkingDir {user}@{hostname}:{cwd}</div>
      <ul>
        {transformDockerContainerPorts(ports).map(([port, protocol], idx) => (
          <li key={idx}>{port}/{protocol}</li>
        ))}
      </ul>
    </Layout>
  )
}

function Volumes({ volumes = {} }) {
  const _volumes = transformDockerContainerVolumes(volumes || {})
  return _volumes.length > 0 && (
    <ul>
      {_volumes.map((volume, idx) => (
        <li key={idx}>{volume}</li>
      ))}
    </ul>
  )
}

function Networks({ networks = {} }) {
  const _networks = transformDockerContainerNetWorks(networks)
  return _networks.length > 0 && (
    <ul>
      {_networks.map((network, idx) => (
        <li key={idx}>{network}</li>
      ))}
    </ul>
  )
}

function Operation({ Running, Paused }) {
  const startOrPause = !Running
        ? (<IconButton className={style.icon} value="play" />)
        : Paused
        ? (<IconButton className={style.icon} value="play" />)
        : (<IconButton className={style.icon} value="pause" />)

  return (
    <Layout size="0">
      {startOrPause}
      <IconButton className={style.icon} value="restart" />
      <IconButton className={style.icon} value="stop" />
    </Layout>
  )
}

function mapContainerStatusToTheme(status): string {
  switch(status) {
    case 'running':
      return 'success'
    case 'restarting':
    case 'paused':
      return 'info'
    case 'created':
    case 'exited':
    case 'dead':
    case 'removing':
      return 'default'
    default:
      throw new Error(`Unknow container status "${status}"`)
  }
}

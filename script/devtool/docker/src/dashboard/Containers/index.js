/**
 * <Containers />
 *
 * @flow
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import { sortBy } from 'lodash'
import { Card, Center, CollectView, Layout, Icon, Pie } from '@component'
import { classnames as cs } from '@util'
import style from './style.css'


/// code

export default function Containers({ Containers, ContainersPaused, ContainersRunning, ContainersStopped }) {
  const chart = mapContainersDataToChartData(
    Containers.length,
    ContainersRunning,
    ContainersStopped,
    ContainersPaused
  )

  // sortBy(Containers, 'State').reverse().map(({ State, Names }) => {
  //   console.log(State, Names)
  // })

  return (
    <Card>
      <Card.Section>
        Containers
      </Card.Section>
      <Card.Section>
        <Layout size="1:0">
          <CollectView value={sortBy(Containers, ['State', 'Created']).reverse().slice(0, 8)}
                       itemView={ListView}
                       className={style.list} />

          <Center>
            <Pie value={chart} className={style.chart}/>
          </Center>
        </Layout>
      </Card.Section>
      <Card.Section>
        <Center>
          <Link to="/containers" >show all containers</Link>
        </Center>
      </Card.Section>
    </Card>
  )
}

function ListView({ Id, State, Names }): React.Node {
  return (
    <Link to={`/container/${Id}`}>
      <Layout align=",center" size="0">
        <span className={cs(style.state, style[`state-${State}`])}></span>
        <span>{Names[0].substr(1)}</span>
      </Layout>
    </Link>
  )
}

function mapContainersDataToChartData(all, running, stopped, paused) {
  return [
    { value: running / all, className: style[`chart-${'running'}`] },
    { value: paused / all, className: style[`chart-${'paused'}`] },
    { value: stopped / all, className: style[`chart-${'stopped'}`] }
  ]
}

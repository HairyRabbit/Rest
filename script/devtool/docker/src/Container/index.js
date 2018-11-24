/**
 * <Container />
 *
 * docker containers view
 *
 * @flow
 */

import * as React from 'react'
import { Layout } from '@component'
import * as docker from '../service/api'
import Info from './Info'
import Log from './Log'


/// code

export default function Container({ match }): React.Node {
  const id = match.params.id
  const [data, setData] = React.useState(null)
  React.useEffect(requestContainerData(id, setData), null !== data)
  console.log(data)
  return data && (
    <Layout vertical>
      <Info {...data} />
      <Log id={id} />
    </Layout>
  )
}

function requestContainerData(id, setData) {
  return function requestContainerData1() {
    docker.getContainer(id).then(setData)
  }
}

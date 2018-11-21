/**
 * <Containers />
 *
 * @flow
 */

import * as React from 'react'
import * as docker from '../service/api'


/// code

export default function Containers(): React.Node {
  const [data, setData] = React.useState(null)
  React.useEffect(requestContainers(setData), null === data)
  console.log(data)
  return (
    <div>

    </div>
  )
}

function requestContainers(setData, ...params) {
  return function requestContainers() {
    return docker.getContainers(...params).then(setData)
  }
}

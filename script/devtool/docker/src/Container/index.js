/**
 * <Container />
 *
 * docker containers view
 *
 * @flow
 */

import * as React from 'react'
import Log from './Log'

/// code

export default function Container({ match }): React.Node {
  const id = match.params.id

  return (
    <div>
      <Log id={id} />
    </div>
  )
}

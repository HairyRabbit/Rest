/**
 * <Container />
 *
 * docker containers view
 *
 * @flow
 */

import * as React from 'react'
import { Layout } from '@component'
import Info from './Info'
import Log from './Log'


/// code

export default function Container({ match }): React.Node {
  const id = match.params.id

  return (
    <Layout vertical>
      <Info id={id} />
      <Log id={id} />
    </Layout>
  )
}

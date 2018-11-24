/**
 * <Image /> container image details, part of container/:id
 * one of collapse group view
 *
 * @flow
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Center, Icon, Typo, Button, Modal } from '@component'
import reset from '@style/reset.css'
import { parseImageId } from '../../../util'


/// code

export default function Image({ id, name }): React.Node {
  return (
    <Layout size="0">
      <Layout size="0:1" gutter="sm">
        <Center fill>
          <Icon value="image" size="xl" />
        </Center>
        <Layout vertical nogutter>
          <Link to={id} className={reset.link}>
            <Typo size="lg" value={name} />
          </Link>
          <Typo size="xs" value={`ID: ${parseImageId(id).short}`} />
        </Layout>
      </Layout>

      <Button onClick={() => {}}>
        Create Image from this container
      </Button>
      <Modal active>
        hhh
      </Modal>
    </Layout>
  )
}

/**
 * page for avatar component
 *
 * @flow
 */

import * as React from 'react'
import { Avatar } from '~component'
import { avatar } from '@rabbitcc/faker'


function Page(): React.Node {
  return <Avatar value={avatar()} />
}

/// export

export default Page

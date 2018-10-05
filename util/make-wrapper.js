/**
 * make wrapper
 *
 * @flow
 */

import * as React from 'react'


/// code

function makeWrapper(Tag?: string = 'div'): * {
  return ({ children, ...props }) => (
    <Tag {...props}>{children}</Tag>
  )
}


/// export

export default makeWrapper

/**
 * <Close />, a svg icon helper, used for closable component
 *
 * @flow
 */

import * as React from 'react'


/// code

export default function Close(props): React.Node {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <path d="M56.843,56.843c3.373,-3.373 3.373,-8.85 0,-12.222l-37.464,-37.464c-3.372,-3.373 -8.849,-3.373 -12.222,0c-3.373,3.373 -3.373,8.85 0,12.222l37.464,37.464c3.372,3.373 8.849,3.373 12.222,0Z"/>
      <path d="M7.157,56.843c3.373,3.373 8.85,3.373 12.222,0l37.464,-37.464c3.373,-3.372 3.373,-8.849 0,-12.222c-3.373,-3.373 -8.85,-3.373 -12.222,0l-37.464,37.464c-3.373,3.372 -3.373,8.849 0,12.222Z"/>
    </svg>
  )
}
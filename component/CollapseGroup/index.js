/**
 * <CollapseGroup /> a group of collapsiable view
 *
 * @flow
 */

import * as React from 'react'
import { Collapse } from '../'
import style from './style.css'


/// code

export type Props = {
  only?: boolean,
  children?: React.Node
}

export default function CollapseGroup({ only, children }: Props = {}): React.Node {
  if('production' !== process.env.NODE_ENV) {

  }

  return (
    <div>
      {React.Children.map(children, (child, idx) => React.cloneElement(child, {
        key: idx
      }))}
    </div>
  )
}

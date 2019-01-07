/**
 * <Header /> task manager header
 */


import { h, Color, Indent, InkNode } from 'ink'
import Spinner from 'ink-spinner'


/// code

export interface Props {
  readonly color?: string
  readonly icon?: InkNode
  readonly value: InkNode
  readonly children?: InkNode
}

export default function Header({ color, icon = <Spinner />, value, children }: Props): InkNode {
  return (
    <Indent>
      <Color keyword={color}>
        {icon} {value}
      </Color>
      <Indent>
        {children}
      </Indent>
    </Indent>
  )
}


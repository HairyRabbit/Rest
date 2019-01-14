/**
 * <Box /> layout component
 */

import { h, InkNode } from 'ink'


/// code

export interface Props {
  readonly padding?: number
  readonly children: InkNode
}

export default function Box({ padding = 1, children }: Props) {
  const pads: Array<InkNode> = Array(padding).fill(0).map(_ => <br />)
  return (
    <div>
      {pads}
      {children}
      {pads}
    </div>
  )
}

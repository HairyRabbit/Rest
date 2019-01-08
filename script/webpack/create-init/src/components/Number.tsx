/**
 * <Number /> task index number view
 */

import { h, Indent, Color } from 'ink'


/// code

export interface Props {
  readonly value: number
}

export default function NumberIndex({ value }: Props) {
  return (
    <Color gray>
      <Indent>
        [{value.toString()}]
      </Indent>
    </Color>
  )
}

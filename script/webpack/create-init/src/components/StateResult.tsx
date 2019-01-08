/**
 * <StateResult /> render task state and result
 */


import { h, Indent, Color } from 'ink'


/// code

export interface Props {
  readonly color: string
  readonly value: string
}

export default function StateResult({ color, value }: Props) {
  return (
    <Color {...{ [color]: true }}>
      <Indent size={1}>{value}</Indent>
    </Color>
  )
}

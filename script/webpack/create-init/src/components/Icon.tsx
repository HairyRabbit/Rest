/**
 * <StateResult /> render task state for icon
 */


import { h, Color } from 'ink'
import Spinner from 'ink-spinner'


/// code

export interface Props {
  readonly color: string
  readonly value: boolean | string
}

export default function StateResult({ color, value }: Props) {
  return (
    <Color {...{ [color]: true }}>
      {'boolean' === typeof value 
        ? (value ? <Spinner /> : null)
        : value}
    </Color>
  )
}

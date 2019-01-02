/**
 * <Task />
 */

import { h, Color } from 'ink'
import Spinner from 'ink-spinner'
import { TaskState } from '../task'

export interface Props {
  readonly value?: TaskState
}

export default function State({ value }: Props = {}) {
  switch(value) {
    case TaskState.Run: return (<Color yellowBright><Spinner type="bounce" /></Color>)
    case TaskState.Done: return (<Color blueBright>✔</Color>)
    case TaskState.Fail: return (<Color magentaBright>✗</Color>)
    case TaskState.Skip: return (<Color yellowBright>✔</Color>)
    default: throw new Error(
      `Unknown task state "${value}"`
    )
  }
}

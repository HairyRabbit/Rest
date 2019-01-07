/**
 * <Task />
 */

import { h, Color } from 'ink'
import Spinner from 'ink-spinner'
import { TaskState, TaskResult } from '../tasker'

export interface Props {
  readonly value: TaskState
  readonly result?: TaskResult
}

export default function State({ value, result }: Props) {
  switch(value) {
    case TaskState.Init: return (<Color gray><Spinner type="bounce" /></Color>)
    case TaskState.Validate: {
      switch(result) {
        case TaskResult.Done: return (<Color blueBright>✔</Color>)
        case TaskResult.Force: return (<Color redBright>✔</Color>)
        case TaskResult.Fail: return (<Color red>✗</Color>)
        default: return (<Color blueBright><Spinner type="bounce" /></Color>)
      }
    }
    case TaskState.Run: return (<Color yellowBright><Spinner type="bounce" /></Color>)
    case TaskState.Complate: {
      switch(result) {
        case TaskResult.Skip: return (<Color yellowBright>✔</Color>)
        case TaskResult.Force: return (<Color redBright>✔</Color>)
        case TaskResult.Fail: return (<Color red>✗</Color>)
        default: return (<Color greenBright>✔</Color>)
      }
    }
    case TaskState.Rollback: return (<Color magentaBright>✗</Color>)
    default: throw new Error(
      `Unknown task state "${value}"`
    )
  }
}

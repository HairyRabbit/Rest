/**
 * <Task />
 */

import { isUndefined } from 'lodash'
import { h, Indent, Bold, Color, InkElement } from 'ink'
import State from './State'
import { TaskBox } from '../manager'
import { TaskState, TaskActionState, TaskResult } from '../tasker'


export interface Props<O> {
  readonly value: TaskBox
  readonly ids: number
}

export default function Task<O>({ ids, value }: Props<O>): InkElement {
  const { id, task, during, issues } = value
  const { title, state, result, description } = task
  return (
    <div>
      <Indent size={1}>
        <State value={state} result={result} />
      </Indent>
      <Indent size={1}>
        [{id.toString().padStart(ids)}]
      </Indent>
      <Indent size={1}>
        <Bold>
          {title}
        </Bold>
      </Indent>
      {/* <Bold>
        {` ${' '.repeat(issues.size * 2)}${title}`}
      </Bold> */}
      {/* {issues.size ? ` {${Array.from(issues).map(t => t.title).join(', ')}}` : null} */}
      {!isUndefined(during) ? <Color gray> ({during}ms)</Color> : null}
      <Indent size={1}>
        - {isUndefined(description)
          ? mapTaskStateToDescription(state, result)
          : description}
      </Indent>
      {issues.length > 0 ? issues.map(({ id, task: { title } }) => (
        <span>
        <br />
        <Indent key={`task-issues-${id}`} size={6}>
          - [{id}] {title}
        </Indent>
        </span>
      )) : null}
    </div>
  )
}

export function mapTaskStateToDescription(state: TaskState, result?: TaskResult): string {
  switch(state) {
    case TaskState.Init: return 'initial...'
    case TaskState.Validate: {
      switch(result) {
        case TaskResult.Skip: return 'skipped'
        case TaskResult.Force: return 'overrided'
        case TaskResult.Fail: return 'failed'
        case TaskResult.Done:
        default: return 'validated'
      }
    }
    case TaskState.Run: return 'runing...'
    case TaskState.Complate: {
      switch(result) {
        case TaskResult.Skip: return 'skipped'
        case TaskResult.Force: return 'overrided'
        case TaskResult.Fail: return 'failed'
        case TaskResult.Done:
        default: return 'successful'
      }
    }
    case TaskState.Rollback: return 'failed'
    default: throw new Error(
      `Unknown task state "${state}"`
    )
  }
}

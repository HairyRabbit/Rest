/**
 * <Task />
 */

import { isUndefined } from 'lodash'
import { h, Indent, Bold, Color, InkElement } from 'ink'
import { Task as ITask, TaskState, isComplated } from '../task'
import State from './State'
import Runner from './Runner'


export interface Props<O> {
  readonly value?: ITask<O>
  readonly depth?: number
}

function Task<O>({ value: { state = TaskState.Run,
                            title,
                            description,
                            beg,
                            end } = {},
                   depth = 0 }: Props<O>): InkElement {
    return (
      <div>
        <Indent size={1}><State value={state} /></Indent>
        <Bold> {' '.repeat(depth * 2)}{title} </Bold>
        {!isUndefined(end) && isComplated(state) ? (<Color gray>({end - beg}ms)</Color>) : null}
        {isUndefined(description)
          ? mapTaskStateToDescription(state)
          : ` - ${description}`}
      </div>
    )
  }
}

export function mapTaskStateToDescription(state?: TaskState): string {
  switch(state) {
    case TaskState.Run: return ' - processing...'
    case TaskState.Done: return ' - successful'
    case TaskState.Fail: return ' - failed'
    case TaskState.Skip: return ' - skipped'
    default: throw new Error(
      `Unknown task state "${state}"`
    )
  }
}

export default Runner(Task)

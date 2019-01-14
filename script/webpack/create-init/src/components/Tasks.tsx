/**
 * <Tasks /> tasks list views
 */

import { h, Fragment } from 'ink'
import Task, { Props as TaskProps } from './Task'
import { TaskBox, TaskManagerRendered } from '../manager'


/// code

export interface Props {
  readonly value: Array<TaskManagerRendered>
}

export default function Tasks({ value }: Props) {
  if(0 === value.length) return null

  return (
    <Fragment>
      {value.map(({ id, name, state, result, description, during, dynamic, depth }) => (
        <Task key={`task-${id}`} 
              id={id}
              name={name}
              state={state}
              result={result}
              description={description}
              during={during}
              dynamic={dynamic}
              depth={depth}
              issues={[]} />
      ))}
    </Fragment>
  )
}

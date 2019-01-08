/**
 * <Tasks /> tasks list views
 */

import { h, Fragment } from 'ink'
import Task, { Props as TaskProps } from './Task'
import { TaskBox } from '../manager'


/// code

export interface Props {
  readonly value: Array<TaskBox>
}

export default function Tasks({ value }: Props) {
  if(0 === value.length) return null

  return (
    <Fragment>
      {value.map(box => (
        <Task key={`task-${box.id}`} 
              id={box.id}
              title={box.task.title}
              state={box.task.state}
              result={box.task.result}
              description={box.task.description}
              during={box.during}
              dynamic={!box.task.static}
              issues={mapToTaskIssues(box.issues)} />
      ))}
    </Fragment>
  )
}

function mapToTaskIssues(issues: TaskBox['issues']): TaskProps['issues'] {
  return Array.from(issues).map(issue => ({ 
    id: issue.id, 
    title: issue.task.title,
    dynamic: !issue.task.static
  }))
}

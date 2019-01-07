/**
 * <Tasks /> views
 */

import { h, Indent, InkElement } from 'ink'
import Header from './Header'
import Task, { mapTaskStateToDescription } from './Task'
import { TaskManager, TaskBox } from '../manager'



/// code

export interface Props<O> {
  readonly sum?: number
  readonly value: TaskManager
  readonly footer?: InkElement
  readonly children?: InkElement
}

export default function Tasks<O>({ ids, sum, value, children, footer }: Props<O>): InkElement {
  const { digits, list } = reduceTaskUIState(value)
  return (
    <div>
      {/* <Indent>
        <Header sum={sum}
                completed={value.counter.value <= 0 ? 0 : value.counter.value - 1}
                cast={value.dur}
                state={mapTaskStateToDescription(value.state)} />
        {children}
      </Indent> */}
      {list.map(box => (
        <Task key={`task-${box.id}`} value={box} ids={digits} />
      ))}
      {/* {isComplated(value.state) ? (
        <div>Completed</div>
      ) : null} */}
    </div>
  )
}

function reduceTaskUIState(taskManager: TaskManager) {
  interface Acc {
    digits: number
    list: Array<TaskBox>
  }
  const acc: Acc = Array.from(taskManager.tasks.values()).reduce<Acc>((a, c) => {
    a.digits = Math.max(a.digits, c.id.toString().length)
    a.list.push({
      ...c,
      issues: Array.from(c.issues)
    })
    return a
  }, { digits: 0, list: [] })

  if(!acc.list.length) return acc
  const list: Array<TaskBox> = []
  acc.list.sort((a, b) => b.issues.length - a.issues.length)
  // console.log(taskManager)
  // console.log(acc.list[0])
  // list.push(acc.list[0])
  // acc.list[0].issues.forEach(pushToList)

  // function pushToList(box: TaskBox) {
  //   list.push(box)
  //   box.issues.forEach(pushToList)
  // }

  
  
  
  // acc.list = list
  return acc
}

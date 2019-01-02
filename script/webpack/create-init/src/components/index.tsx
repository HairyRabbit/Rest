/**
 *
 */

import { h, render } from 'ink'
import Tasks from './Tasks'
import Task from './Task'
import { isArray } from 'lodash'
import { TaskState, isDone } from '../task'


/// code

function App(rootTasks) {
  const { views, ...rest } = renderTasks(rootTasks)
  return render(
    <Tasks {...rest} value={rootTasks}>
      {views}
    </Tasks>
  )
}

function renderTasks(root): any {
  const acc: { views: any[], done: number, sum: number } = { views: [], done: 0, sum: 0 };

  (function recur(tasks, depth, acc): void {
    tasks.forEach((task, idx: number) => {
      acc.views.push(<Task key={`${task.depth}-${idx}`} depth={depth} value={task} />)
      acc.sum += 1
      if(isDone(task.state)) acc.done += 1
      if(!(isArray(task.children) && 0 !== task.children.length)) return
      recur(task.children, depth + 1, acc)
    })
  })(root.children, 0, acc)

  return acc
}

export default App

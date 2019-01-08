/**
 * application views
 */

import { h, render } from 'ink'
import Manager from './Manager'
import { TaskManager } from '../manager'


/// code

export default function App(taskManager: TaskManager): void {
  taskManager.start(
    render(<Manager value={taskManager} />)
  )
}

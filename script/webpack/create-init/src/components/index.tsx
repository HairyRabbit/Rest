/**
 * application views
 */

import { h, render } from 'ink'
import Manager from './Manager'
import { TaskManager } from '../manager'


/// code

export default function App<T>(taskManager: TaskManager): void {
  taskManager.start(
    render(<Manager state={taskManager.state} value={taskManager} />)
  )
}

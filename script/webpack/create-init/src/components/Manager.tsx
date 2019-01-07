/**
 * <Manager /> task manager view
 */

import { h, Indent, Fragment, Color, InkElement } from 'ink'
import Spinner from 'ink-spinner'
import ConfirmInput from 'ink-confirm-input'
import Box from './Box'
import Header from './Header'
import Exit from './Exit'
import Tasks from './Tasks'
import { TaskManager, TaskManagerState, TaskManagerResult } from '../manager'
import ErrorList from './ErrorList'

export interface Props {
  readonly value: TaskManager
  readonly state: TaskManagerState
}

export default function Manager({ value, state }: Props): InkElement {
  switch(value.state) {
    case TaskManagerState.Init: return (
      <Box>
        <Header value="initializing ..." />
      </Box>
    )

    case TaskManagerState.Start: return (
      <Box>
        <Header value="starting ..." />
      </Box>
    )
    
    case TaskManagerState.Validate: {
      switch(value.result) {
        case TaskManagerResult.Fail: {
          return (
            <Fragment>
              <Box>
                <Header color="red" icon="✗" value="validate failed" />
              </Box>
              <Box>
                <Indent size={4}>
                  <Tasks value={value} />
                </Indent>
              </Box>
              <Box>
                <ErrorList value={Array.from(value.errors)} />
              </Box>
            </Fragment>
          )
        }
        case TaskManagerResult.Done: return (
          <Box>
            <Header color="blue" icon="✓" value="validated" />
          </Box>
        )
        default: return (
          <Box>
            <Header color="blue" value="validating ..." />
          </Box>
        )
      }
    }

    case TaskManagerState.Run: 
    case TaskManagerState.Rollback: {
      switch(value.result) {
        case TaskManagerResult.Done: {
          return (
            <Fragment>
              <Box>
                <Header color="green" icon="✓" value="task complated">
                  skipped {value.tasks.size}, complated {value.tasks.size}
                </Header>
              </Box>
              <Box>
                <Indent size={4}>
                  <Tasks value={value} />
                </Indent>
              </Box>
              <Box>
                <Exit handler={value.exit} />
              </Box>
            </Fragment>
          )
        }
        case TaskManagerResult.Fail: {
          return (
            <Fragment>
              <Box>
                <Header color="red" icon="✗" value="task failed">
                  skipped {value.tasks.size}, complated {value.tasks.size}
                </Header>
              </Box>
              <Box>
                <Tasks value={value} />
              </Box>
              <Box>
                rollback? (Y/n)
                <ConfirmInput checked value="" />
              </Box>
            </Fragment>
          )
        }
        default: {
          return (
            <Fragment>
              <Box>
                <Indent>
                  <Color blue>
                    <Spinner type="toggle4" /> task runing ...  skipped {value.tasks.size}, complated {value.tasks.size}
                  </Color>
                </Indent>
              </Box>
              <Box>
                <Tasks value={value} />
              </Box>
            </Fragment>
          )
        }
      }
    }
  
    default: throw new Error(
      `Unknown state "${state}"`
    )
  }
}

/**
 * <Manager /> task manager view
 */

import { h, Indent, Fragment, Color, InkElement } from 'ink'
import Box from './Box'
import Tasks from './Tasks'
import { TaskManager, mapToTaskManagerStateProps } from '../manager'
import ErrorList from './ErrorList'
import Icon from './Icon'
import StateResult from './StateResult'

export interface Props {
  readonly value: TaskManager
}

export default function Manager({ value }: Props): InkElement {
  const { icon, color, state } = mapToTaskManagerStateProps(value.state, value.result)
  
  return (
    <Fragment>
      <Header />
      <Body />
      <Footer />
    </Fragment>
  )

  function Header() {
    return (
      <Box>
        <Indent>
          <Icon color={color} value={icon} />
          <StateResult color={color} value={state} />
          <Color grey>
            <Indent>({value.tasks.size})</Indent>
          </Color>
        </Indent>
      </Box>
    )
  }

  function Body() {
    return (
      <Box>
        <Indent size={3}>
          <Tasks value={Array.from(value.tasks.values())} />
        </Indent>
      </Box>
    )
  }

  function Footer() {
    return (
      <Box>
        <Indent>
          <ErrorList value={Array.from(value.errors)} />
        </Indent>
      </Box>
    )
  }
}

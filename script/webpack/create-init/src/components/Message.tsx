/**
 * <Message />
 */

import { h, Indent, Fragment, Color } from 'ink'
import { TaskManagerMessageRendered } from '../manager'
import Icon from './Icon'
import Id from './Number'


/// code

interface Props {
  readonly value: Array<TaskManagerMessageRendered>
}

function Message({ value }: Props) {
  if(0 === value.length) return null

  return (
    <Fragment>
      <Icon color="redBright" value="🌶" /> <Color redBright>Errors</Color>
      <br />
      <br />
      {value.map(({ id, name, msg }) => (
        <Fragment>
          <div key={`message-${id}`}>
            <Id value={id} />
            <Indent>
              <Color redBright>{name}</Color>
            </Indent>
          </div>
          <br />
          <div>
            <Indent size={5}>
              {msg}
            </Indent>
          </div>
        </Fragment>
      ))}
    </Fragment>
  )
}

export { Props }
export default Message

/**
 * <Tasks /> views
 */

import { h, Indent, InkElement } from 'ink'
import Header from './Header'
import { mapTaskStateToDescription } from './Task'
import { isComplated } from '../task'



/// code

export interface Props {
  readonly value?: Array<any>
}

export default function Tasks({ sum, value, children, footer }: Props): InkElement {
  return (
    <div>
      <Indent>
        <Header sum={sum}
                completed={value.counter}
                cast={value.end - value.beg}
                state={mapTaskStateToDescription(value.state)} />
        {children}
      </Indent>
      <br />
      <br />
      {isComplated(value.state) ? (
        <div>Completed</div>
      ) : null}
    </div>
  )
}

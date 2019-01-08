/**
 * <ErrorList />
 */

import { h, Indent, Fragment, Color } from 'ink'
import { TaskBox } from '../manager'
import Id from './Number'


/// code

export interface Props {
  readonly value: Array<{ box: TaskBox, error: Error }>
}

export default function ErrorList({ value }: Props) {
  if(0 === value.length) return null

  return (
    <Fragment>
      {value.map(({ box, error }) => (
        <Fragment>
          <div key={box.id}>
            <Id value={box.id} />
            <Color redBright>{box.task.title}</Color>
          </div>
          <br />
          <div>
            <Indent size={5}>
              {error.stack}
            </Indent>
          </div>
        </Fragment>
      ))}
    </Fragment>
  )
}

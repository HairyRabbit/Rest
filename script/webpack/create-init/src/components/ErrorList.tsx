/**
 * <ErrorList />
 */

import { h, Indent, Fragment, Color } from 'ink'
import { TaskBox } from '../manager'


/// code

export interface Props {
  readonly value: Array<{ box: TaskBox, error: Error }>
}

export default function ErrorList({ value }: Props) {
  /**
   * `indent` align by length of id
   */
  const indent: number = value.reduce(
    (acc, curr) => Math.max(acc, curr.box.id.toString().length), 
  0) + 2
  
  return (
    <Fragment>
      {value.map(({ box, error }) => (
        <Fragment>
          <div key={box.id}>
            <Color gray>[{box.id}]</Color> <Color redBright>{box.task.title}</Color>
          </div>
          <br />
          <div>
            <Indent size={indent}>
              {error.stack}
            </Indent>
          </div>
        </Fragment>
      ))}
    </Fragment>
  )
}

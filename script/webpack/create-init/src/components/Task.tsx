/**
 * <Task />
 */

import { isUndefined } from 'lodash'
import { h, Indent, Fragment, Bold, Color } from 'ink'
import { mapToTaskStateProps, TaskManagerRendered } from '../manager'
import { TaskState, TaskResult } from '../tasker'
import StateResult from './StateResult'
import Icon from './Icon'
import Id from './Number'


/// code

export interface Props extends TaskManagerRendered {}

export default function Task({ id, name, state, result, description, during, issues, dynamic, depth }: Props) {
  const { color, icon, state: str } = mapToTaskStateProps(state, result)
  return (
    <div>
      <Indent size={depth}>
        <Icon color={color} value={icon} />
        <Id value={id} />
        <Title value={name} />
        <Dynamic value={dynamic} />
        <During />
        <Indent>-</Indent>
        <StateResult color={color} value={str} />
        <Description />
        {/* <Issues /> */}
      </Indent>
    </div>
  )

  function Title({ value }: { value: string }) {
    return (
      <Indent>
        <Bold>
          {value}
        </Bold>
      </Indent>
    )
  }

  function Dynamic({ value }: { value?: boolean }) {
    if(!value) return null

    return (
      <Color magentaBright>
        <Indent>
          {`{dynamic}`}
        </Indent>
      </Color>
    )
  }

  function During() {
    if(isUndefined(during)) return null

    return (
      <Color gray>
        <Indent>
          ({during}ms)
        </Indent>
      </Color>
    )
  }

  function Description() {
    if(isUndefined(description)) return null

    return (
      <Fragment>
        ,
        <Indent>
          {description}
        </Indent>
      </Fragment>
    )
  }

  function Issues() {
    if(0 === issues.length) return null

    return (
      <Fragment>
        {issues.map(issue => <Issue key={`task-issue-${issue.id}`} {...issue} />)}
      </Fragment>
    )
  }

  function Issue<T extends Props['issues']>({ id, title, dynamic }: T extends Array<infer R> ? R : never) {
    return (
      <Fragment>
        <br />
        <Indent key={`task-issues-${id}`} size={2}>
          <Color gray><Indent>└</Indent></Color>
          <Id value={id} />
          <Title value={title} />
          <Dynamic value={dynamic} />
        </Indent>
      </Fragment>
    )
  }
}

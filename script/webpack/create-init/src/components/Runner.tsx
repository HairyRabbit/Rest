/**
 * HOC for run task at `componentDidMount` hook
 */

import { h, Component, InkComponent } from 'ink'
import { Task } from '../task'

interface Props<O> {
  readonly value: Task<O>
}

function Runner(Comp: InkComponent) {
  return class WrappedComponent<O> extends Component<Props<O>> {
    static displayName = `Runner(${Comp.name})`
    componentDidMount() {
      this.props.value!.up()
    }
    render() {
      return (<Comp {...this.props} />)
    }
  }
}

export default Runner

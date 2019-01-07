/**
 * <Exit /> exit app with count down
 */

import { h, Component, Color, Indent, Bold, InkElement } from 'ink'
import TextInput from 'ink-text-input'


/// code

export interface Props {
  readonly value?: number
  handler(): void
}

export interface State {
  counter: number
}

export default class Exit extends Component<Props, State> {
  private timer: any = null
  private handler: Props['handler']

  constructor(props: Props) {
    super()
    
    this.state = {
      counter: props.value || 5
    }

    this.handler = props.handler
  }

  componentDidMount(): void {
    this.timer = setInterval(() => {
      this.setState(({ counter: this.state.counter - 1}), () => {
        if(!~this.state.counter) {
          clearInterval(this.timer)
          this.handler()
        }
      })
    }, 1000)
  }

  render(): InkElement {
    const { counter } = this.state
    return (
      <Indent>
        <Color blue>!</Color> exit after <Bold><Color blueBright>{counter}</Color></Bold> second{1 >= counter ? '' : 's'}, 
        or process <Bold>any</Bold> key to exit it.
        <TextInput value={''} onChange={this.handler} onSubmit={this.handler} />
      </Indent>
    )
  }
}

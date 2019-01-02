import { h, Component, Color, Indent, Bold } from 'ink'
import Spinner from 'ink-spinner'
import ProgressBar from 'ink-progress-bar'
import Task from './components/Task'
import { TaskState } from './task'
import Header from './components/Header'


/// code

export default class Counter extends Component<{}, { i: number }> {
  timer!: any
  constructor() {
		super();

		this.state = {
			i: 0
		};
	}

	render() {
		return (
      <Indent>
        <Header sum={20} completed={5} />

        <Task name="base tasks" depth={0} description="processing..." />
        <Task state={TaskState.Done} name="create .gitignore" depth={1} description="ok" />
        <Task state={TaskState.Fail} name="create .editorconfig" depth={1} description="failed, target exists" />
        <Task state={TaskState.Skip} name="create .editorconfig" depth={1} description="skipped, target exists and valid" />
      </Indent>
		)
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({
				i: this.state.i + 1
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}
}

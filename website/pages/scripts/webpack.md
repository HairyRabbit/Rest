```code
import style from '../../style/typo.css'
import * as echarts from 'echarts'
import Graph from '~component/chart/graph'
import Title from '~component/chart/title'

const nodes = [
  { name: '1', x: 10, y: 10, value: 10 },
  { name: '2', x: 15, y: 15, value: 12 }
]
const links = [
  { source: '1', target: '2' }
]
```

# webpack()

webpack builder

<Graph nodes={nodes} links={links}>
  <Title text="foo" />
</Graph>

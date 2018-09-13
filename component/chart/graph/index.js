/**
 * <Graph />
 *
 * echarts graph
 *
 * @link [series-graph](http://echarts.baidu.com/option.html#series-graph)
 * @flow
 */


import * as React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/graph'
import Chart from '../'
import withMount from '../../withMount'


/// code

type Graph = {
  id?: string,
  name?: string,
  legendHoverLink?: boolean,
  coordinateSystem?:
    | null
    | 'none'
    | 'cartesian2d'
    | 'polar'
    | 'geo',
  xAxisIndex?: number,
  yAxisIndex?: number,
  polarIndex?: number,
  geoIndex?: number,
  calendarIndex?: number,
  hoverAnimation?: boolean,
  layout?:
    | 'none'
    | 'circular'
    | 'force',
  circular?: {
    rotateLabel?: boolean
  },
  force?: {
    initLayout?: string,
    repulsion?: Array<number>,
    gravity?: number,
    edgeLength?: Array<number>,
    layoutAnimation?: boolean
  },
  roam?: boolean,
  nodeScaleRatio?: number,
  draggable?: boolean,
  focusNodeAdjacency?: boolean,
  symbol?:
    | 'circle'
    | 'rect'
    | 'roundRect'
    | 'triangle'
    | 'diamond'
    | 'pin'
    | 'arrow'
    | 'none',
  symbolSize?: number | Array<number> | (value: number | Array<number>, params: Object) => number | Array<number>,
  symbolRotate?: number,
  symbolKeepAspect?: boolean,
  symbolOffset?: Array<number | string>,
  edgeSymbol?: string | Array<string>,
  edgeSymbolSize?: number | Array<number>,
  cursor?: string,
  itemStyle?: Object,
  lineStyle?: Object,
  label?: Object,
  edgeLabel?: Object,
  emphasis?: Object,
  categories?: Array<Object>,
  data?: Array<Object>,
  nodes?: Array<Object>,
  links?: Array<Object>,
  edges?: Array<Object>,
  markPoint?: Object,
  markLine?: Object,
  markArea?: Object,
  zlevel?: number,
  z?: number,
  left?: string | number,
  top?: string | number,
  right?: string | number,
  bottom?: string | number,
  width?: string | number,
  height?: string | number,
  silent?: boolean,
  animation?: boolean,
  animationThreshold?: number,
  animationDuration?: number,
  animationEasing?: string,
  animationDelay?: number | Function,
  animationDurationUpdate?: number | Function,
  animationEasingUpdate?: string,
  animationDelayUpdate?: number | Function,
  tooltip?: Object
}

type Props = {
  container: React.ElementRef<HTMLElement>
} & Graph

function Graph({ ...props }: Props) {
  return (
    <Chart {...props} />
  )
}


/// export

export default Graph

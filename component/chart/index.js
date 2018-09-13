/**
 * <Chart />
 *
 * wrapper for echarts chart container
 *
 * @flow
 */

import * as React from 'react'
import echarts from 'echarts/lib/echarts'
import { withMount } from '../'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

type Props = {
  className?: string,
  container?: React.ElementRef,
  children?: React.Node
}

function Chart({ className, container, ...props }: Props): React.Node {
  console.log(props)
  return (
    <div ref={container}
         className={cs(style.main, className)}
         style={{ height: '200px' }}></div>
  )
}


/// hoc:withMount

function mount({ children, container, ...props }) {
  console.log(children, props)
  props.type = 'graph'
  const chart = echarts.init(container.current).setOption({
    series: [props]
  })

  return chart
}

function unmount(_, ret): void {
  console.log(ret)
  ret.dispose()
}


/// export

export default withMount(mount, unmount)(Chart)

/**
 * <Title />
 *
 * echarts title component
 *
 * @flow
 */

import * as React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'


/// code

type Props = {
  id?: string,
  show?: boolean,
  text?: string,
  link?: string,
  target?: 'self' | 'blank',
  textStyle?: Object,
  subtext?: string,
  sublink?: string,
  subtarget?: string,
  subtextStyle?: Object,
  padding?: number | [number, number] | [number, number, number, number],
  itemGap?: number,
  zlevel?: number,
  z?: number,
  left?: number | 'auto' | 'left' | 'center' | 'right' | string,
  top?: number | 'auto' | 'top' | 'middle' | 'bottom' | string,
  right?: number | 'auto' | string,
  bottom?: number | 'auto' | string,
  backgroundColor?: string,
  borderColor?: string,
  borderWidth?: number,
  borderRadius?: number | [number, number, number, number],
  shadowBlur?: number,
  shadowColor?: string,
  shadowOffsetX?: number,
  shadowOffsetY?: number
}

function Title({ ...props}: Props): React.Node {
  return null
}


/// export

export default Title

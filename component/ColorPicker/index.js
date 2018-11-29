/**
 * <ColorPicker /> used for select color
 *
 * @flow
 */

import * as React from 'react'
import { isFunction, memoize } from 'lodash'
import { classnames as cs } from '../../util'
import { Slider, PointMonitor } from '../'
import style from './style.css'


/// code

const HUE_MAX = 360
const HUE_MIN = 0
const CURSOR_SIZE: number = parseFloat(style.cursorSize)

export type Props = {

}

export default function ColorPicker({}: Props = {}): React.Node {
  const [ hue, setHue ] = React.useState(HUE_MIN)
  const [ point, setPoint ] = React.useState({ x: 0, y: 0 })

  /**
   * @compute [point]
   */
  const cursorStyle = {
    transform: `translate(${point.x - CURSOR_SIZE / 2}px, ${point.y - CURSOR_SIZE / 2}px)`
  }

  /**
   * @compute [point,hue]
   */
  const colorStyle = {
    backgroundColor: `hsl(${computeHue()}, ${computeSaturation()}, ${computeLightness()})`
  }

  /**
   * @compute [hue]
   */
  const hueStyle = {
    backgroundColor: `hsl(${computeHue()}, 100%, 50%)`
  }

  return (
    <div className={style.main}>
      <Slider value={hue}
              onChange={setHue}
              className={style.bar} />
      <PointMonitor point={point} onChange={setPoint}>
        <div className={style.box}>
          <div className={style.hsl}></div>
          <div className={style.hue} style={hueStyle}></div>
          <div className={style.cursor} style={cursorStyle} />
        </div>
      </PointMonitor>
      <div>Hue {computeHue()}</div>
      <div>Saturation {computeSaturation()}</div>
      <div>Lightness {computeLightness()}</div>
      <div className={style.color} style={colorStyle} />
    </div>
  )

  function computeHue() {
    return Math.round(HUE_MAX * hue).toString()
  }

  function computeSaturation(): string {
    if(!point.rect) return '0%'
    return Math.round(point.x / (point.rect.maxX - point.rect.minX) * 100).toString() + '%'
  }

  function computeLightness(): string {
    if(!point.rect) return '100%'
    return 100 - Math.round(point.y / (point.rect.maxY - point.rect.minY) * 100).toString() + '%'
  }
}

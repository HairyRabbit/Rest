/**
 * <Slider /> slider component for range for number selection
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { combineClassNames as cc,
         numberScope,
         useProp,
         useRect } from '../../util'
import handleMouseWheel from '../../util/event/wheel-handler'
import { DEFAULT_MODIFIER_PERCENT } from '../../util/event/key-modifier'
import { PointMonitor, Draggable } from '../'
import style from './style.css'


/// code

const CURSOR_SIZE: number = parseFloat(style.cursorSize)

export type Props = {
  min?: number,
  max?: number,
  step?: number,
  value: number,
  onChange?: () => any,
  className?: string,
  trackProps?: Object,
  cursorProps?: Object,
  fieldProps?: Object
}

export default function Slider({ value, onChange, className, children, trackProps: { className: trackClassName, ...trackProps } = {}, cursorProps: { className: cursorClassName, style: cursorStyle, ...cursorProps } = {}, barProps: { className: barClassName, ...barProps } = {}, ...props }: Props = {}): React.Node {
  /**
   * precheck
   */
  if('production' !== process.env.NODE_ENV) {

  }

  const [ _value, setValue ] = useProp(value, onChange, 0)
  const [ point, setPoint ] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef()
  const rect = useRect(containerRef)
  const handleWheel = handleMouseWheel(subscriptionWheel, DEFAULT_MODIFIER_PERCENT)


  /**
   * sync point with rect
   */
  React.useEffect(syncPoint, [rect, _value])


  /**
   * @compute [point]
   */
  const cursorTranslateStyle = {
    transform: `translate(${point.x - CURSOR_SIZE / 2}px)`
  }

  return (
    <div className={cc(style.main, className)}>
      <PointMonitor value={point}
                    onChange={handlePointChange}>
        {({ ...injects }) => (
          <div ref={containerRef}
               className={cc(style.track, trackClassName)}
               onWheel={handleWheel}
               {...trackProps}
               {...injects}>
            <div className={cc(style.cursor, cursorClassName)}
                 style={{ ...cursorTranslateStyle, ...cursorStyle }}
                 {...cursorProps} />
            <div className={cc(style.bar, barClassName)}
                 {...barProps} />
            {children}
          </div>
        )}
      </PointMonitor>
      <input type="range"
             value={_value}
             onChange={onChange}
             className={style.field}
             {...props} />
    </div>
  )

  /**
   * handle <PointMonitor /> onChange, and convert point to value
   */
  function handlePointChange(evt) {
    if(!rect) return

    const { pageX: x, pageY: y } = evt
    const { left, top, right, bottom, width } = rect

    const calc = numberScope(x, { min: left, max: right }) - left

    setPoint({ x: calc, y: 0 })
    setValue(calc / width)
  }

  function subscriptionWheel(evt, wheel, base) {
    if(!rect) return
    const { width } = rect
    const delta = wheel * base * width
    const calc = numberScope(point.x + delta, { min: 0, max: width })

    setPoint({
      x: calc,
      y: point.y
    })
    setValue(calc / width)
  }

  /**
   * used for sync point state on fetch DOMRect
   *
   * @prop sync
   */
  function syncPoint() {
    if(!rect) return
    setPoint({ x: _value * rect.width, y: 0 })
  }
}

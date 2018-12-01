/**
 * <Slider /> slider component for range for number selection
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs, numberScope, useProp, useRect } from '../../util'
import { PointMonitor, Draggable } from '../'
import style from './style.css'


/// code

const CURSOR_SIZE: number = parseFloat(style.cursorSize)

export type Props = {
  sync: boolean,
  value: number,
  onChange?: () => any,
  className?: string,
  trackProps?: Object,
  cursorProps?: Object,
  fieldProps?: Object
}

export default function Slider({ value, onChange, className, children, trackProps: { className: trackClassName, ...trackProps } = {}, cursorProps: { className: cursorClassName, style: cursorStyle, ...cursorProps }, barProps: { className: barClassName, ...barProps } = {}, ...props }: Props = {}): React.Node {
  /**
   * precheck
   */
  if('production' !== process.env.NODE_ENV) {

  }

  const containerRef = React.useRef()
  const rect = useRect(containerRef)
  const [ _value, setValue ] = useProp(value, onChange, 0)
  const [ point, setPoint ] = React.useState({ x: 0, y: 0 })

  /**
   * sync point with rect
   */
  React.useEffect(syncPoint, [rect])


  /**
   * @compute [point]
   */
  const cursorTranslateStyle = {
    transform: `translate(${point.x - CURSOR_SIZE / 2}px)`
  }

  return (
    <div className={cs(style.main, className)}>
      <PointMonitor value={point} onChange={handlePointChange}>
        {({ ...injects }) => (
          <div ref={containerRef}
               className={cs(style.track, trackClassName)}
               {...trackProps}
               {...injects}>
            <div className={cs(style.cursor, cursorClassName)}
                 style={{ ...cursorTranslateStyle, ...cursorStyle }}
                 {...cursorProps} />
            <div className={cs(style.bar, barClassName)}
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

  /**
   * used for sync point state
   *
   * @prop sync
   */
  function syncPoint(): void {
    if(!rect) return
    setPoint({ x: computePointFromValue(_value), y: 0 })
  }

  /**
   * convert value to point
   */
  function computePointFromValue(value) {
    if(!rect) return 0
    return value * rect.width
  }
}

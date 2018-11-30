/**
 * <Slider /> slider component for range for number selection
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { classnames as cs, useProp } from '../../util'
import { PointMonitor, Draggable } from '../'
import style from './style.css'


/// code

const CURSOR_SIZE: number = parseFloat(style.cursorSize)

export type Props = {
  value: number,
  onChange?: () => any,
  className?: string,
  trackProps?: Object,
  cursorProps?: Object,
  fieldProps?: Object
}

export default function Slider({ value,
                                 onChange,
                                 className,
                                 trackProps: { className: trackClassName,
                                               ...trackProps } = {},
                                 cursorProps: { className: cursorClassName,
                                                style: cursorStyle,
                                                ...cursorProps },
                                 barProps: { className: barClassName,
                                             ...barProps } = {},
                                 ...props }: Props = {}): React.Node {
  if('production' !== process.env.NODE_ENV) {
    // console.log(children.ref)
  }

  const [ _value, setValue ] = useProp(value, onChange, 0)
  const [ point, setPoint ] = React.useState({ x: value, y: 0 })

  /**
   * @compute [point]
   */
  const cursorTranslateStyle = {
    transform: `translate(${point.x - CURSOR_SIZE / 2}px)`
  }

  return (
    <div className={cs(style.main, className)}>
      <PointMonitor point={point} onChange={handleChange} axis="x">
        <div className={cs(style.track, trackClassName)} {...trackProps}>
          <div className={cs(style.cursor, cursorClassName)}
               style={{ ...cursorTranslateStyle, ...cursorStyle }}
               {...cursorProps} />

          <div className={cs(style.bar, barClassName)}
               {...barProps} />
        </div>
      </PointMonitor>
      <input type="range"
             value={_value}
             onChange={evt => setValue(evt.target.value)}
             className={style.field}
             {...props} />
    </div>
  )

  function handleChange(point) {
    setValue(point.x / (point.rect.maxX - point.rect.minX))
    setPoint(point)
  }
}

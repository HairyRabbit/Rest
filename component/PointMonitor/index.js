/**
 * <PointMonitor /> same as Draggable, but works for area
 *
 * @flow
 */

import * as React from 'react'
import { useProp, numberScope } from '../../util'


/// code

export type Props = {
  value: Point,
  axis: 'x' | 'y',
  onMouseDown: () => any
}

export default function PointMonitor({ value, onChange, children }: Props = {}): React.Node {
  if('production' !== process.env.NODE_ENV) {
    // console.log(children.ref)
  }

  // const [ isAllowX, isAllowY ] = parseAxis(axis)
  const [ _value, setPoint ] = useProp(value, onChange, { x: 0, y: 0 })
  const containerRef = React.useRef(null)
  const rect = React.useRef({ x: 0, y: 0 })
  // React.useEffect(computeRect, null !== containerRef.current)

  return children({ onMouseDown: handleMouseDown })
  // return React.Children.only(React.cloneElement(children, {
  //   ref: containerRef,
  //   onMouseDown: handleMouseDown
  // }))

  function computeRect(): void {
    const {
      left: minX,
      top: minY,
      right: maxX,
      bottom: maxY
    } = containerRef.current.getBoundingClientRect()

    rect.current = { minX, minY, maxX, maxY }
    setPointFromEvent()
    return cleanupEvents
  }

  function handleMouseDown(evt): void {
    setPoint(evt)
    document.addEventListener('mousemove', setPoint)
    document.addEventListener('mouseup', cleanupEvents)
  }

  function cleanupEvents(): void {
    document.removeEventListener('mousemove', setPoint)
    document.removeEventListener('mouseup', cleanupEvents)
  }

  function setPointFromEvent(evt): void {
    const { pageX: x, pageY: y } = evt || { pageX: _value.x, pageY: _value.y }
    const { minX, minY, maxX, maxY } = rect.current

    setPoint({ x, y })

    // setPoint({
    //   x: !isAllowX ? _value.x : numberScope(x, { min: minX, max: maxX }) - minX,
    //   y: !isAllowY ? _value.y : numberScope(y, { min: minY, max: maxY }) - minY,
    //   rect: rect.current
    // })
  }
}


function parseAxis(axis: Axis): [boolean, boolean] {
  switch(axis) {
    case true:
    case 'both': return [true, true]
    case 'x': return [true, false]
    case 'y': return [false, true]
    case false: return [false, false]
    default: throw new Error(`Invaild Property axis, "${axis}"`)
  }
}

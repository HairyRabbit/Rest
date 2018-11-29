/**
 * <PointMonitor /> same as Draggable, but works for area
 *
 * @flow
 */

import * as React from 'react'
import { useProp, numberScope } from '../../util'


/// code

export type Props = {
  axis: 'x' | 'y',
  onMouseDown: () => any
}

export default function PointMonitor({ point, onChange, axis = true, style, children }: Props = {}): React.Node {
  if('production' !== process.env.NODE_ENV) {
    // console.log(children.ref)
  }

  const [ isAllowX, isAllowY ] = parseAxis(axis)
  const [ _point, setPoint ] = useProp(point, onChange, { x: 0, y: 0 })
  const containerRef = React.useRef(null)
  const rect = React.useRef({ x: 0, y: 0 })
  React.useEffect(computeRect, null !== containerRef.current)

  return React.Children.only(React.cloneElement(children, {
    ref: containerRef,
    onMouseDown: handleMouseDown
  }))

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
    setPointFromEvent(evt)
    document.addEventListener('mousemove', setPointFromEvent)
    document.addEventListener('mouseup', cleanupEvents)
  }

  function cleanupEvents(): void {
    document.removeEventListener('mousemove', setPointFromEvent)
    document.removeEventListener('mouseup', cleanupEvents)
  }

  function setPointFromEvent(evt): void {
    const { pageX: x, pageY: y } = evt || { pageX: _point.x, pageY: _point.y }
    const { minX, minY, maxX, maxY } = rect.current

    setPoint({
      x: !isAllowX ? _point.x : numberScope(x, { min: minX, max: maxX }) - minX,
      y: !isAllowY ? _point.y : numberScope(y, { min: minY, max: maxY }) - minY,
      rect: rect.current
    })
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

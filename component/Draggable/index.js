/**
 * <Draggable />
 *
 * @flow
 */

import * as React from 'react'
import { useProp } from '../../util'


/// code

export type Point = {
  x: number,
  y: number
}

export type Axis = 'both' | 'x' | 'y'

export type Props = {
  axis?: Axis,
  children: React.Node,
  style?: { [string]: string },
  scope?: {
    x?: {
      min?: number,
      max?: number
    },
    y?: {
      min?: number,
      max?: number,
    }
  },
  relative?: Point,
  onChange?: Point => any,
  translate?: Point,
  onMove?: Point => any
}

export default function Draggable({ relative, onChange, translate, onMove, axis = 'both', scope, style = {}, children }: Props = {}): React.Node {
  if('production' !== process.env.NODE_ENV) {

  }

  const [ isAllowX, isAllowY ] = parseAxis(axis)
  const {
    x: { min: minX = -Infinity, max: maxX = +Infinity } = {},
    y: { min: minY = -Infinity, max: maxY = +Infinity } = {}
  } = scope || {}

  const dragged = React.useRef({ x: 0, y: 0 })
  const dragging = React.useRef({ x: 0, y: 0 })
  const range = React.useRef({
    minX: -Infinity,
    maxX: +Infinity,
    minY: -Infinity,
    maxY: +Infinity
  })
  const [ _relative, setRelative ] = useProp(relative, onChange, { x: 0, y: 0 })
  const [ _translate, setTranslate ] = useProp(translate, onMove, { x: 0, y: 0 })
  const containerRef = React.useRef(null)
  React.useEffect(computePosition, null !== containerRef.current)

  return React.Children.only(React.cloneElement(children, {
    ref: containerRef,
    onMouseDown: handleMouseDown,
    style: {
      left: `${_relative.x}px`,
      top: `${_relative.y}px`,
      transform: `translate(${_translate.x}px, ${_translate.y}px)`,
      ...style
    }
  }))

  function computePosition() {
    const computedStyle = getComputedStyle(containerRef.current, null)
    const [ position, left, top ] = [
      computedStyle.getPropertyValue('position'),
      computedStyle.getPropertyValue('left'),
      computedStyle.getPropertyValue('top')
    ]
    // @todo assert position if static
    // if(position) {}
    setRelative({
      x: CSSStyleValue.parse('left', left).value,
      y: CSSStyleValue.parse('top', top).value
    })
    return function cleanupEvents() {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }

  function handleMouseDown(evt): void {
    const { pageX: x, pageY: y } = evt
    dragging.current = { x: 0, y: 0 }
    dragged.current = { x, y }
    range.current = {
      minX: minX - _relative.x,
      maxX: maxX - _relative.x,
      minY: minY - _relative.y,
      maxY: maxY - _relative.y
    }

    // console.log(`drag start at (${dragged.current.x},${dragged.current.y})`)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(evt): void {
    const { pageX: x, pageY: y } = evt

    dragging.current = {
      x: !isAllowX ? dragging.current.x : Math.max(range.current.minX, Math.min(range.current.maxX, x - dragged.current.x)),
      y: !isAllowY ? dragging.current.y : Math.max(range.current.minY, Math.min(range.current.maxY, y - dragged.current.y))
    }

    setTranslate(dragging.current)

    // console.log(`drag move offset (${dragging.current.x},${dragging.current.y}) point: (${x},${y}), from: (${dragged.current.x},${dragged.current.y}), range rect x (${minX},${maxX}) y (${minY},${maxY})`)
  }

  function handleMouseUp(evt): void {
    setRelative(({ x, y }) => ({
      x: x + dragging.current.x,
      y: y + dragging.current.y
    }))

    setTranslate({ x: 0, y: 0 })

    // console.log(`drag end at (${_relative.x + dragging.current.x},${_relative.y + dragging.current.y}), point (${dragged.current.x},${dragged.current.y}), offset (${dragging.current.x},${dragging.current.y})`)

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
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

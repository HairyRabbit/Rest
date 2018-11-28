/**
 * <Draggable />
 *
 * @flow
 */

import * as React from 'react'


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
  }
}

export default function Draggable({ axis = 'both', scope, style = {}, children }: Props = {}): React.Node {
  const dragged = React.useRef({ x: 0, y: 0 })
  const dragging = React.useRef({ x: 0, y: 0 })
  const [ relative, setRelative ] = React.useState({ x: 0, y: 0 })
  const [ translate, setTranslate ] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef(null)
  React.useEffect(computePosition, null !== containerRef.current)

  const [ isAllowX, isAllowY ] = parseAxis(axis)
  const {
    x: { min: minX = -Infinity, max: maxX = +Infinity } = {},
    y: { min: minY = -Infinity, max: maxY = +Infinity } = {}
  } = scope || {}

  return React.Children.only(React.cloneElement(children, {
    ref: containerRef,
    onMouseDown: handleMouseDown,
    style: {
      left: `${relative.x}px`,
      top: `${relative.y}px`,
      transform: `translate(${translate.x}px, ${translate.y}px)`,
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
    console.log(`drag start at (${dragged.current.x},${dragged.current.y})`)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(evt): void {
    const { pageX: x, pageY: y } = evt
    dragging.current = {
      x: !isAllowX ? dragging.current.x : isInScope(),
      y: !isAllowY ? dragging.current.y : y - dragged.current.y
    }
    setTranslate(dragging.current)
    console.log(`drag move offset (${dragging.current.x},${dragging.current.y}) point: (${x},${y}), from: (${dragged.current.x},${dragged.current.y})`)

    function isInScope() {
      const detalX = x - dragged.current.x
      if(detalX + relative.x >= maxX) return dragging.current.x
      else if(detalX + relative.x <= minX) return dragging.current.x
      else return detalX
    }
  }

  function handleMouseUp(evt): void {
    setRelative(({ x, y }) => ({
      x: x + dragging.current.x,
      y: y + dragging.current.y
    }))

    setTranslate({ x: 0, y: 0 })

    console.log(`drag end at (${relative.x + dragging.current.x},${relative.y + dragging.current.y}), point (${dragged.current.x},${dragged.current.y}), offset (${dragging.current.x},${dragging.current.y})`)

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

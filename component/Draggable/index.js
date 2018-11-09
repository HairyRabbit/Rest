/**
 * <Draggable />
 *
 * @flow
 */

import * as React from 'react'


/// code

export default function Draggable({}: Options = {}) {
  let x = 0, dx = 0, ex = 0
  return function WithDraggableComponent(Component) {

    // const [x, setX] = React.useState(0)
    // const [dx, setDx] = React.useState(0)
    // const [ex, setEx] = React.useState(0)
    const [style, setStyle] = React.useState({})
    return function DraggableComponent({ onMouseDown, ...props }: Props = {}) {
      console.log(ex)
      return (
        <Component onMouseDown={handleMouseDown}
                   style={style}
                   {...props} />
      )
    }

    function handleMouseDown(evt) {
      x = evt.pageX
      dx = 0
      // ex = 0
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    function handleMouseUp(evt) {
      ex = dx
      if(ex > 18.59375 / 2) {
        ex = 18.59375
        setStyle({
          transform: `translateX(0)`,
          left: '100%'
        })
      } else {
        ex = 0
        setStyle({
          transform: `translateX(0)`,
          left: '0%'
        })
      }
      // setStyle({
      //   transform: `translateX(0)`,
      // })

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    function handleMouseMove(evt) {
      dx = Math.min(18.59375, Math.max(0, ex + evt.pageX - x))
      // setDx(evt.pageX - x)
      setStyle({
        transform: `translateX(${dx}px)`
      })
    }
  }
}

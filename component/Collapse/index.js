/**
 * <Collapse /> dropdown view
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  summary?: React.Node,
  children?: React.Node
}

export default function Collapse({ summary, children }: Props = {}): React.Node {
  if('production' !== process.env.NODE_ENV) {

  }

  const [_active, setActive] = React.useState(false)
  const [contentHeight, setContentHeight] = React.useState(null)
  const [height, setHeight] = React.useState('')
  const [timer, setTimer] = React.useState(null)
  const contentRef = React.useRef(null)
  React.useEffect(computeContentHeight, contentHeight)

  const contentStyle = { height }
  const contentClassNames = cs(
    !timer ? (!_active && style.hide) : style.transition,
  )

  return (
    <div>
      <div onClick={handleToggle}>
        {summary}
      </div>
      <div ref={contentRef}
           className={contentClassNames}
           style={contentStyle}>
        {children}
      </div>
    </div>
  )

  function computeContentHeight() {
    contentRef.current.style.display = 'block'
    const contentHeight = contentRef.current.clientHeight
    contentRef.current.style.display = ''
    setContentHeight(contentHeight)
    return function clearTimer() {
      if(timer) clearTimeout(timer)
    }
  }

  function cleanup(stop) {
    setActive(!_active)
    if(!stop) setHeight('')
    clearTimeout(timer)
    setTimer(null)
  }

  function handleToggle() {
    const during = parseInt(style.during)

    /**
     * always stop prev transition
     */
    cleanup(true)

    /**
     * swap height with active state and set min/max height for
     * transition current frame and next frame
     */
    if(!_active) {
      setHeight('0px')
      requestAnimationFrame(() => {
        setHeight(contentHeight.toString() + 'px')
      })
    } else {
      setHeight(contentHeight.toString() + 'px')
      requestAnimationFrame(() => {
        setHeight('0px')
      })
    }

    setTimer(setTimeout(cleanup, during))
  }
}

/**
 * <ScrollView />
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export default function ScrollView({ children, className, ...props }): React.Node {
  const [height, setHeight] = React.useState(null)
  const [top, setTop] = React.useState(null)
  const containerRef = React.useRef(children.ref)

  React.useEffect(computeHeight, null !== height)
  console.log(containerRef)

  return (
    <div className={style.main} {...props}>
      <div className={cs(style.container, className)}>
        {React.Children.only(React.cloneElement(children, {
          ref: containerRef.current,
          onScroll: handleScroll
        }))}
      </div>
      <div className={cs(style.scroller, style[`scroller-${'vertical'}`])}
           style={{ height: height + 'px', top: top * 100 + '%' }} />
    </div>
  )

  function computeHeight() {
    const { offsetHeight, scrollHeight } = containerRef.current.current
    console.log(offsetHeight, scrollHeight)
    setHeight(offsetHeight / scrollHeight * offsetHeight)
  }

  function handleScroll() {
    const { scrollHeight, scrollTop } = containerRef.current.current
    setTop(scrollTop / scrollHeight)
  }
}

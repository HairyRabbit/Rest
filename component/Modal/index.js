/**
 * <Modal />, modal sub view
 *
 * @flow
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { classnames as cs, useProp, randomString as rs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  name?: string,
  active?: boolean,
  onActiveChange?: ($PropertyType<Props, 'active'> => void),
  children?: React.Node,
  className?: string
}

export default function Modal({ children, active, onActiveChange, className }: Props = {}) {
  const containerRef = React.useRef(document.body)
  const [ _active, setActive ] = useProp(active, onActiveChange, false)
  React.useEffect(toggleBodyClass, [_active])

  if(!_active) return null

  return createPortal((
    <div className={cs(style.main)}>
      <div className={cs(style.overlay)} onClick={handleHiddenModal}></div>
      <div className={cs(style.container, className)}>
        {children}
      </div>
    </div>
  ), containerRef.current)

  function handleHiddenModal(): void {
    setActive(false)
  }

  function toggleBodyClass(): void {
    document.body.classList.toggle(style.overflow, _active)
  }

  // React.useEffect(mountView(containerRef))
  // function mountView(container) {
  //   document.body.appendChild(container.current)
  //   return function unMountView() {
  //     document.body.removeChild(container.current)
  //   }
  // }
}

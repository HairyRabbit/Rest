/**
 * <Modal />, modal sub view
 *
 * @flow
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Layout, Close, Card } from '../'
import { classnames as cs, useProp, randomString as rs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  active?: boolean,
  onChange?: ($PropertyType<Props, 'active'> => void),
  children?: React.Node,
  className?: string
}

export default function Modal({ children, active, onChange, className }: Props = {}) {
  if('production' !== process.env.NODE_ENV) {

  }

  const containerRef = React.useRef(document.body)
  const [ _active, setActive ] = useProp(active, onChange, false)
  React.useEffect(toggleBodyClass, [_active])

  if(!_active) return null

  return createPortal((
    <div className={cs(style.main)}>
      <div className={cs(style.overlay)} onClick={handleHiddenModal}></div>
      {React.Children.only(React.cloneElement(children, {
        className: cs(style.container, className)
      }))}
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

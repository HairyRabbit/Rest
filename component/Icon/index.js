/**
 * <Icon />, icon view, use svg
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  value: string,
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  className?: string,
  children?: React.Node
}


/**
 * use React <svg /> component when mode was development
 */
function SVGComponent({ children, className, size = 'md', value, ...props }: Props = {}) {
  const SVGComponent = require(`${process.env.ICON_CONTEXT}/${value}.svg`).default
  return <SVGComponent role="img"
                       className={cs(style.main, style[`size-${size}`], className)} />
}

/**
 * use <svg><use xlinkhref></svg> at production mode
 */
function SVGStoreComponent({ children, className, size = 'md', value, ...props }: Props = {}) {
  const name = process.env.ICON_STORE || '/icons.svg'
  const inline = process.env.ICON_STORE_INLINE || false
  return (
    <svg role="img" className={cs(style.main, style[`size-${size}`], className)}>
      <use xlinkHref={`${inline ? name : ''}#${value}`} />
    </svg>
  )
}


export default function Icon(props: Props = {}): React.Node {
  return 'production' === process.env.NODE_ENV
    ? <SVGStoreComponent {...props}/>
    : <SVGComponent {...props} />
}

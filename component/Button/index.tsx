/**
 * <Button />, The most common component.
 *
 * @example
 *
 * ```js
 * import { Button } from '@component'
 *
 * <Button value="foo" />
 * ```
 *
 * @prop {Type} - type [`Type.BUTTON`], the button type, oneof `button` and `submit`
 * @prop {Size} - size [`Size.MD`], button size, oneof `xs`, `sm`, `md`, `lg`, `xl`
 * @prop {Theme} - theme [`Theme.DEFAULT`], button color, oneof `default`, `primary`, `secondary` and status theme `success`, `error`, `info` and `warning`
 * @prop {Surface} - surface [`Surface.FLAT`], button style, oneof `outline`, `flat`, `text`
 * @prop {boolean} - block [`false`], should button display box was a block, default is inline-block, if set, button width will be set to 100%
 * @prop {boolean} - active [`false`], should button be active state
 * @prop {string} - value, the button text, basically value and children all was ok, if both set, value will be use more then children, it's useful when button text was very simple
 */

import { isUndefined } from 'lodash'
import * as React from 'react'
import { combineClassNames as cc } from '../../util'
import * as style from './style.scss'


/// code

export enum Type {
  BUTTON = 'button',
  SUBMIT = 'submit'
}

export enum Size {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

export enum Theme {
  DEFAULT   = 'default',
  PRIMARY   = 'primary',
  SECONDARY = 'secondary',
  SUCCESS   = 'success',
  INFO      = 'info',
  WARNING   = 'warning',
  ERROR     = 'error'
}

export enum Surface {
  OUTLINE = 'outline',
  FLAT    = 'flat',
  TEXT    = 'text'
}

export interface Props {
  readonly type?: Type
  readonly size?: Size
  readonly theme?: Theme,
  readonly surface?: Surface
  readonly block?: boolean
  readonly active?: boolean
  readonly className?: string
  readonly value?: string
  readonly children?: React.Component
}

/**
 * @memo
 */
export default function Button({ type = Type.BUTTON,
                                 theme = Theme.PRIMARY,
                                 size = Size.MD,
                                 surface = Surface.FLAT,
                                 block = false,
                                 active = false,
                                 className,
                                 value,
                                 children,
                                 ...props }: Props = {}) {

  const classNames: string = cc(
    style.main,
    block && style.block,
    style.theme,
    style[`theme-${theme}`],
    style[`size-${size}`],
    style[`surface-${surface}`],
    className
  )

  return (
      <button className={classNames}
    type={type}
    {...props}>
      {value || children}
    </button>
  )
}

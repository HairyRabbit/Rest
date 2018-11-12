/**
 * <FormItem /> form control view, include label, field, and
 * helper three parts.
 *
 * @flow
 */


import * as React from 'react'
import { Layout } from '../'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  type?: 'vertical' | 'horizontal' | 'between',
  name?: string,
  label?: string,
  required?: boolean | string,
  children?: React.Node
} & HorizontalProps

export type HorizontalProps = {
  align?: 'left' | 'right'
}

export default function FormItem({ type = 'vertical', name, align = 'right', label, required, helper, children, ...props }: Props = {}): React.Node {
  const child = React.Children.only(React.cloneElement(
    children,
    { name, ...props }
  ))

  switch(type) {
    case 'vertical':
      return (
        <Layout vertical gutter="xs" {...props}>
          <label htmlFor={name} className={style.label}>
            {label}
          </label>
          {child}
          <Layout>
            {helper && (<div className={style.helper}>{helper}</div>)}
          </Layout>
        </Layout>
      )
    case 'horizontal':
      return (
        <Layout size="16.6667%:1" {...props}>
          <label htmlFor={name} className={cs(style.label, style[`align-${align}`])}>
            {label}
          </label>
          <Layout vertical gutter="xs">
            {child}
            {helper && (<div className={style.helper}>{helper}</div>)}
          </Layout>
        </Layout>
      )
    case 'between':
      return (
        <Layout align=",center" size="1:0">
          <Layout vertical nogutter>
            <label htmlFor={name} className={style.label}>
              {label}
            </label>
            <div className={style.helper}>{helper}</div>
          </Layout>
          {child}
        </Layout>
      )
    default:
      throw new Error(`Unknow layout property ${type}`)
  }
}

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
  label?: string,
  required?: boolean | string,
  children?: React.Node
} & HorizontalProps

export type HorizontalProps = {
  align?: 'left' | 'right'
}

export default function FormItem({ type = 'vertical', align = 'right', label, required, helper, children, ...props }: Props = {}): React.Node {
  const { name } = children.props
  const componetType = children.type.name

  switch(type) {
    case 'vertical':
      return (
        <Layout vertical gutter="xs" {...props}>
          <label htmlFor={name} className={style.label}>
            {label}
          </label>
          {children}
          <Layout>
            {helper && (<div className={style.helper}>{helper}</div>)}
          </Layout>
        </Layout>
      )
    case 'horizontal':
      // 16.6667%
      return (
        <Layout size="25%:50%:25%" {...props}>
          <label htmlFor={name}
                 className={cs(style.label, 'TextField' === componetType && style.box, style[`align-${align}`])}>
            {label}
          </label>
          <Layout vertical gutter="xs">
            {children}
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
          {children}
        </Layout>
      )
    default:
      throw new Error(`Unknow layout property ${type}`)
  }
}

/**
 * <Tag />
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  className?: string,
  value?: string
}

export default function Tag({ value, className }: Props = {}): React.Node {
  return (
    <div className={cs(style.main, className)}>{value}</div>
  )
}

/**
 * <NumberInput /> used for number type data
 */

/// <reference types="../../typings" />

import * as React from 'react'
import { TextField } from '../'
import { classnames as cs } from '../../util'
import * as style from './style.css'


/// code

export interface Props {
  readonly min?: Number
  readonly max?: Number
  readonly value?: String
  readonly className?: String
  onChange(evt: Event): void
}

export default function NumberInput({ min, max, value, onChange, className, ...props}: Props): React.Node {
  return (
    <div className={style.main}>
      <div className={style.spins}>
        <div className={cs(style.spin, style[`spin-${'top'}`])} />
        <div className={cs(style.spin, style[`spin-${'bottom'}`])} />
      </div>
      <TextField type="number"
                 className={cs(style.field, className)}
                 value={value}
                 onChange={onChange}
                 {...props} />
    </div>
  )
}

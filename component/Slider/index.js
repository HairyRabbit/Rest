/**
 * <Slider /> slider component for range for number selection
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import { Draggable } from '../'
import style from './style.css'


/// code

export type Props = {
  className?: string
}

export default function Slider({ className, ...props }: Props = {}): React.Node {
  return (
    <div className={cs(style.main, className)}>
      <Draggable axis="x" scope={{ x: { min: 0, max: 100 }}}>
        <div className={style.cursor} />
      </Draggable>
      <input type="range" className={style.field} />
    </div>
  )
}

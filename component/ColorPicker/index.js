/**
 * <ColorPicker /> used for select color
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import { Slider } from '../'
import style from './style.css'


/// code

export default function ColorPicker(): React.Node {
  return (
    <div className={style.main}>
      <Slider />
      <div className={style.bar}></div>
      <div className={style.area}>
        <div className={style.hsl}></div>
        <div className={style.hue}></div>
      </div>
    </div>
  )
}

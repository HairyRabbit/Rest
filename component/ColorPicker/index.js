/**
 * <ColorPicker /> used for select color
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'


/// code

export default function ColorPicker(): React.Node {
  return (
    <div>
      <div className={style.white}></div>
      <div className={style.black}></div>
      <div className={style.color}></div>
    </div>
  )
}

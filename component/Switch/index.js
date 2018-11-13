/**
 * <Switch />, on/off view, just like a switch
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs, randomString as rs } from '../../util'
import style from './style.css'
import thinStyle from './thin.css'
import fatStyle from './fat.css'
import withDraggable from '../Draggable'


/// code

export type Props = {
  theme?: 'thin' | 'fat',
  name?: string,
  checked?: boolean,
  onChange?: Function,
  className?: string
}

const themeStyle = {
  thin: thinStyle,
  fat: fatStyle
}

export default function Switch({ name, checked, onChange, className, theme = 'fat', ...props }: Props = {}): React.Node {
  const state = checked ? 'on' : 'off'
  const id = name || '__SWITCH_ID__' + rs()
  return (
    <label htmlFor={id} className={cs(style.main, themeStyle[theme].main, style[state], className)} {...props}>
      <div className={style.container}>
        <div className={cs(style.cursor, themeStyle[theme].cursor, style[state])}></div>
      </div>
      <input id={id} name={id}
             className={style.field}
             type="checkbox"
             checked={checked}
             onChange={onChange} />
    </label>
  )
}

// const fn = withDraggable()

// export default function Switch({ name, checked, onChange, className, ...props }: Props = {}): React.Node {
//   const state = checked ? 'on' : 'off'
//   const id = name || '__SWITCH_ID__' + randomString()
//   const Cursor = fn(
//     (props) => <div className={cs(style.cursor, style[state])} {...props}></div>
//   )
//   return (
//     <label htmlFor={id} className={cs(style.main, style[state], className)} {...props}>
//       <div className={style.container}>
//         <Cursor />
//       </div>
//       <input id={id} name={id}
//              className={style.field}
//              type="checkbox"
//              checked={checked}
//              onChange={onChange} />
//     </label>
//   )
// }

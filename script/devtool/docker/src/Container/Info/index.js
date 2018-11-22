/**
 * <Info /> view, part of <Container />
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'


/// code

export default function Info({ id }) {
  return (
    <header className={style.main}>
      {id}
    </header>
  )
}

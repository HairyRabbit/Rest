/**
 * <ButtonGroup /> button group, map for one or more of datas
 *
 * @flow
 */

import * as React from 'react'
import { Button } from '../'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export default function ButtonGroup({ value = [], className, ...props }): React.Node {
  return (
    <div className={style.main} {...props}>
      {value.map(mapToButton)}
    </div>
  )

  function mapToButton({ value, checked, ...rest }, idx) {
    return (
      <Button key={idx}
              className={cs(style.button, checked && style.active, className)}
              {...props}
              {...rest}>
        {value}
      </Button>
    )
  }
}

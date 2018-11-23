/**
 * <IconButton /> button but for icon
 *
 * @flow
 */

import * as React from 'react'
import { Button, Icon } from '../'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props = {
  value?: string,
  className?: string
}

export default function IconButton({ value, className, ...props }: Props = {}): React.Node {
  return (
    <Button theme="default" className={cs(style.main, className)}>
      <Icon value={value} {...props} />
    </Button>
  )
}

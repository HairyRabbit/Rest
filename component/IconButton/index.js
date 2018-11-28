/**
 * <IconButton /> button but for icon
 *
 * @flow
 */

import * as React from 'react'
import { Button, Icon } from '../'
import { classnames as cs } from '../../util'
import type { Props as IconProps } from '../Icon'
import style from './style.css'


/// code

export type Props = {
  value?: string,
  className?: string,
  iconProps?: IconProps
}

export default function IconButton({ value, className, iconProps = {}, ...props }: Props = {}): React.Node {
  return (
    <Button theme="default" className={cs(style.main, className)} {...props}>
      <Icon value={value} {...iconProps} />
    </Button>
  )
}

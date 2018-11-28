/**
 * <ModalView /> add more layouts base on <Modal />
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'
import { Modal, Layout, Center, Close, Card, Button } from '../'
import { classnames as cs, useProp } from '../../util'
import type { Props as ModalProps } from '../Modal'
import style from './style.css'


/// code

export type Props = {
  children?: React.Node,
  title?: React.Node,
  actions?: React.Node,
  onCloseClick?: SyntheticEvent<HTMLElement> => any
} & ModalProps

export default function ModalView({ active, onChange, children, title, onCloseClick, actions = [], cancel, align = 'right', ...props }: Props = {}) {
  if('production' !== process.env.NODE_ENV) {

  }

  const [ _active, setActive ] = useProp(active, onChange, false)

  return (
    <Modal active={_active} onChange={setActive} {...props}>
      <Card>
        {title && (<Header onCloseClick={handleCloseClick}>
                     {title}
                   </Header>)}

        <div>{children}</div>

        {actions.length > 0 && (<Footer actions={actions}
                                        onCloseClick={handleCloseClick}
                                        cancel={cancel}
                                        align={align} />)}
      </Card>
    </Modal>
  )

  function handleCloseClick(evt) {
    if(evt.isDefaultPrevented && isFunction(onCloseClick)) {
      onCloseClick(evt)
      return
    }

    setActive(false)
  }
}

function Header({ icon, close = true, children, className, onCloseClick, ...props }): React.Node {
  return (
    <header className={cs(style.header, className)} {...props}>
      {children}
      {close && (<Center className={style.close}>
                   <Close className={style.icon}
                          onClick={onCloseClick} />
                 </Center>)}
    </header>
  )
}

function Footer({ className, actions, align, cancel, onCloseClick }): React.Node {
  if(cancel) {
    actions.unshift(
      <Button key="cancle"
              theme="default"
              onClick={onCloseClick}>Cancel</Button>
    )
  }

  return (
    <Layout className={cs(style.footer, style[`align-${align}`], className)}
            size="0"
            gutter="xs"
            align={`end,center`}
            tag="footer">
      {actions}
    </Layout>
  )
}

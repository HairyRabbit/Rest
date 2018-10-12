/**
 * <Header />
 *
 * for <h2>
 *
 * @flow
 */

import * as React from 'react'
import { Layout } from '~component'
import { classnames as cs } from '../../../util'
import reset from '~style/reset.css'
import WingLeft from '../../asserts/WingLeft.svg'
import WingRight from '../../asserts/WingRight.svg'
import style from './style.css'


/// code

type Props = {
  children?: React.Node
}

function Header({ children, ...props }: Props = {}): React.Node {
  return (
    <Layout size="0" center className={style.main} {...props}>
      <img src={WingLeft} className={style.left} />
      <h2 className={reset.header}>{children}</h2>
      <img src={WingRight} className={style.right} />
    </Layout>
  )
}


/// export

export default Header

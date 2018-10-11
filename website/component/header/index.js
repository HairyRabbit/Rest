/**
 * <Header />
 *
 * @flow
 */

import * as React from 'react'
import { Layout } from '~component'
import { classnames as cs } from '../../../util'
import WingLeft from '../../asserts/WingLeft.svg'
import WingRight from '../../asserts/WingRight.svg'
import style from './style.css'


/// code

function Header({ children, ...props }): React.Node {
  return (
    <Layout size="0" center className={style.main} {...props}>
      <img src={WingLeft} className={style.left} />
      <span>{children}</span>
      <img src={WingRight} className={style.right} />
    </Layout>
  )
}


/// export

export default Header

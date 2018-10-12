/**
 * <Example />
 *
 * example view
 *
 * @flow
 */

import * as React from 'react'
import { Layout } from '~component'
import reset from '~style/reset.css'
import style from './style.css'


/// code

type Props = {
  children?: React.Node,
  value?: string
}

function Example({ children, value, ...props }: Props = {}): React.Node {
  return (
    <Layout center {...props}>
      <figure className={reset.figure}>
        <div className={style.main}>
          {children}
        </div>
        <figcaption className={style.text}>
          {value}
        </figcaption>
      </figure>
    </Layout>
  )
}


/// export

export default Example

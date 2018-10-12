/**
 * <Sidebar />
 *
 * docker ui navigator
 *
 * @flow
 */

import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Layout } from '~component'
import style from './style.css'


/// code

function Sidebar() {
  return (
    <Layout fill className={style.main} tag="aside">
      <Layout list vertical>
        <NavLink to="/dashboard">dashboard</NavLink>
        <NavLink to="/image">images</NavLink>
        <NavLink to="/container">containers</NavLink>
      </Layout>
    </Layout>
  )
}


/// export

export default Sidebar

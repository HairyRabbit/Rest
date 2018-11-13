/**
 * <Sidebar />
 *
 * docker ui navigator
 *
 * @flow
 */

import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Icon } from '~component'
import style from './style.css'


/// code

const nav = [{
  href: '/dashboard',
  icon: 'Core',
  content: 'Dashboard'
},{
  href: '/image',
  icon: 'Layer',
  content: 'Images'
},{
  href: '/container',
  icon: 'Container',
  content: 'Containers'
}]

function Sidebar(): React.Node {
  return (
    <aside className={style.main}>
      <Layout fill vertical size="1:2">
        <Logo />

        <Layout list vertical size="1" gutter="sm">
          {nav.map(({ href, icon, content }, idx) => (
            <NavLink to={href}
                     activeClassName={style.active}
                     className={style.link}
                     key={idx}>
              <Layout center size="0:1">
                <div className={style.icon}>
                  <Icon value={icon} />
                </div>
                {content}
              </Layout>
            </NavLink>
          ))}
        </Layout>
      </Layout>
    </aside>
  )
}

function Logo(): React.Node {
  return (
    <Layout fill align="center,end" className={style.logo}>
      <svg viewBox="0 0 64 64">
        <path d="M27.279,28.721c-4.207,-9.098 -4.013,-18.308 2.854,-27.685c7.786,4.178 12.049,10.425 13.806,16.821c9.332,-0.551 16.597,1.544 20.144,4.955c-3.917,11.571 -12.647,15.17 -23.478,14.762c-3.6,10.403 -14.31,25.627 -21.064,25.39c-6.753,-0.237 -20.747,-21.106 -19.458,-26.813c1.29,-5.707 24.366,-5.651 27.196,-7.43Z"/>
      </svg>
    </Layout>
  )
}



/// export

export default Sidebar

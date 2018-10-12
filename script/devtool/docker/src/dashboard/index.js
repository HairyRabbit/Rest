/**
 * <Dashboard />
 *
 * docker ui dashboard container
 *
 * @flow
 */

import * as React from 'react'
import { Layout } from '~component'


/// code

function Dashboard() {
  return (
    <Layout vertical>
      docker version 1.38

      <Layout>
        <div>42</div>
        <div>42</div>
        <div>42</div>
      </Layout>
    </Layout>
  )
}


/// export

export default Dashboard

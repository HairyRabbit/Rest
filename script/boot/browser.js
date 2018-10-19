/**
 * browser
 *
 * browser app bootstrapper
 *
 * @var __BOOT_NODE__ - app mount node
 * @var __BOOT_INITIAL__ - app initial scripts path
 * @var __BOOT_CONTEXT__ - app injection context
 * @flow
 */

import * as React from 'react'
import { render } from 'react-dom'
import { ensureNode } from '~util'
import Root from './'


/// code

function main(): Promise<*> {
  const node = ensureNode(global.__BOOT_NODE__)
  const ctx = global.__BOOT_CONTEXT__ || {}

  if(global.__BOOT_INITIAL__) {
    const initial = require(global.__BOOT_INITIAL__).default
    return initial(ctx).then(ctx => {
      render(<Root ctx={ctx} />, node)
    })
  } else {
    return Promise.resolve(
      render(<Root ctx={ctx}/>, node)
    )
  }
}


/// export

export default main


/// run

main()

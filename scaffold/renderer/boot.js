/**
 * website boot
 *
 * @flow
 */

import * as React from 'react'
import { render } from 'react-dom'
import Root from './'


/**
 * install mount node if not found by id
 */
function ensureMountNode(id: string): HTMLElement {
  const node = document.getElementById(id)

  if(node) return node

  const mount = document.createElement('div')
  mount.id = id

  if(!document.body) {
    throw new Error(
      `document.body not found`
    )
  }

  document.body.appendChild(mount)

  return mount
}

function main() {
  const node = ensureMountNode('app')
  render(<Root />, node)
}

console.log(require('http'))
/// run

main()

/**
 * website boot
 *
 * @flow
 */

import * as React from 'react'
import { render } from 'react-dom'
import '../style/main.css'


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

import Avatar from './pages/components/avatar.md'

function main() {
  const node = ensureMountNode('app')
  render(<Avatar />, node)
}


/// run

main()

/**
 * website boot
 *
 * @flow
 */

import * as React from 'react'
import { render } from 'react-dom'
import { ensureNode } from '~util'
import initial from './initial'
import Root from './'


/// code

function main() {
  return initial().then(() => {
    const node = ensureNode('app')
    render(<Root />, node)
  })
}


/// export

export default main


/// run

main()

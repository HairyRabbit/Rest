/**
 * website boot
 *
 * @flow
 */

import * as React from 'react'
import { render } from 'react-dom'
import { ensureNode } from '~util'
import Root from './'


/// code

function main() {
  return render(<Root />, ensureNode('app'))
}

/// export

export default main


/// run

main()

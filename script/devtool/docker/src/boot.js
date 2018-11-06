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

export default function main() {
  return render(<Root />, ensureNode('app'))
}


/// run

main()

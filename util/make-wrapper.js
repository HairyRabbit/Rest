/**
 * make-wrapper
 *
 * make wrapper with given tag, default to "div"
 *  
 * @flow
 */

import * as React from 'react'


/// code

type Props = {
  children?: React.Node
}

function makeWrapper(Tag?: string | React.ComponentType<*> = 'div'): * {
  return ({ children, ...props }: Props = {}): React.Node => (
    <Tag {...props}>{children}</Tag>
  )
}


/// export

export default makeWrapper


/// test

import assert from 'assert'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

describe('util Function makeWrapper()', () => {
  Enzyme.configure({ adapter: new Adapter() })

  it('should be default tag "div"', () => {
    const Component = makeWrapper()
    assert.deepStrictEqual('<div></div>', shallow(<Component />).html())
  })

  it('should pass string tag', () => {
    const Component = makeWrapper('section')
    assert.deepStrictEqual('<section></section>', shallow(<Component />).html())
  })

  it('should pass Component as tag ok', () => {
    const Comp = () => <div />
    const Component = makeWrapper(Comp)
    assert.deepStrictEqual('<div></div>', shallow(<Component />).html())
  })
})
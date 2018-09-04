/**
 * <Avatar />
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'
import { classnames as cs } from '../../util'


type Style =
  | 'circle'
  | 'round'
  | 'rect'

type Props = {
  value: string,
  size: string,
  style: Style
}

function Avatar({ value, size, style = 'circle', ...props }: Props): React.Node {
  if('production' !== process.env.NODE_ENV) {

  }

  const imageClassNames = cs(
    style.image
  )

  return (
    <div className={style.main}>
      <img className={style.image}
           src={value} />
    </div>
  )
}


/// export

export default Avatar


/// test

import assert from 'assert'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

describe('component <Avatar />', () => {

  Enzyme.configure({ adapter: new Adapter() })

  it('default props', () => {
    const comp = shallow(<Avatar />)
    assert(`
<div>
  <img />
</div>
`.replace(/\s+/g, '') === comp.html())
  })
})

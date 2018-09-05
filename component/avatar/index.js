/**
 * <Avatar />
 *
 * @flow
 */

import * as React from 'react'
import style from './style.css'
import { classnames as cs } from '../../util'


type Size =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | string

type Round =
  | boolean
  | 'sm'
  | 'md'
  | 'lg'
  | string

type Props = {
  value: string,
  size?: Size,
  round?: Round
}

function Avatar({ value, size = 'md', round = true, classNames = {}, className, styles = {}, style: componentStyle, ...props }: Props): React.Node {
  if('production' !== process.env.NODE_ENV) {
    if(!value) {
      throw new Error(
        `<Avatar /> value property was required, but got ${value}`
      )
    }

    if('string' !== typeof value) {
      throw new Error(
        `<Avatar /> value property should be string, but got ${typeof value}`
      )
    }
  }

  const [ sizeClassName, sizeStyle ] = mapSize(size)
  const [ roundClassName, roundStyle ] = mapRound(round)
  const mainClassNames = cs(
    style.main,
    sizeClassName,
    classNames.main,
    className
  )
  const imageClassNames = cs(
    style.image,
    roundClassName,
    classNames.image
  )
  const mainStyles = {
    ...sizeStyle,
    ...styles.main,
    ...componentStyle
  }
  const imageStyles = {
    ...roundStyle,
    ...styles.image
  }

  return (
    <div className={mainClassNames}
         style={mainStyles}>
      <img className={imageClassNames}
           style={imageStyles}
           src={value} />
    </div>
  )
}


function mapSize(size: Size): [?string, ?{ width: string, height: string }] {
  switch(size) {
    case 'xs':
      return [style.sizeXS, null]
    case 'sm':
      return [style.sizeSM, null]
    case 'md':
      return [style.sizeMD, null]
    case 'lg':
      return [style.sizeLG, null]
    case 'xl':
      return [style.sizeXL, null]
    default:
      return [null, { width: size, height: size }]
  }
}



function mapRound(round: Round): [?string, ?{ borderRadius: string }] {
  switch(typeof round) {
    case 'boolean':
      return [round ? style.circle : style.rect, null]
    case 'string':
      switch(round) {
        case 'sm':
          return [style.roundSM, null]
        case 'md':
          return [style.roundMD, null]
        case 'lg':
          return [style.roundLG, null]
        default:
          return [null, { borderRadius: round }]
      }
    default:
      return [null, null]
  }
}


/// export

export default Avatar


/// test

import assert from 'assert'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

describe('component <Avatar />', (done) => {

  Enzyme.configure({ adapter: new Adapter() })

  it('default props', () => {
    const comp = shallow(
      <Avatar value="foo" />
    )
    const expected = `

<div class="main sizeMD">
  <img class="image circle" src="foo" />
</div>

`.replace(/\>\s+/g, '>').replace(/\s+\</g, '<').replace(/\s+\/\>/g, '/>')
    assert(expected === comp.html())
  })

  it('helper mapRound()', () => {
    assert.deepStrictEqual(mapRound(true), [style.circle, null])
    assert.deepStrictEqual(mapRound(false), [style.rect, null])
    assert.deepStrictEqual(mapRound('42rem'), [null, { borderRadius: '42rem' }])
    assert.deepStrictEqual(mapRound(null), [null, null])
  })

  it('helper mapSize()', () => {
    assert.deepStrictEqual(mapSize('md'), [style.sizeMD, null])
    assert.deepStrictEqual(mapSize('42rem'), [null, { width: '42rem', height: '42rem' }])
  })
})

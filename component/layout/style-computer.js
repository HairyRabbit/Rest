/**
 * style-computer
 *
 * computer row/col styles
 *
 * @flow
 */

/// code

function computeStyle(value: string, negative: boolean, ...keys: Array<string>): { [key: string]: string } {
  const ele = negative ? '-1' : '1'
  const cmp = `calc(${ele} * ${value} / 2)`

  return keys.reduce((acc, curr) => {
    acc[curr] = cmp
    return acc
  }, {})
}


/// export

export default computeStyle


/// test

import assert from 'assert'

describe('Function computStyle()', () => {
  it('should return styles', () => {
    assert.deepStrictEqual(
      { foo: `calc(1 * 42 / 2)` },
      computeStyle('42', false, 'foo')
    )
  })
})

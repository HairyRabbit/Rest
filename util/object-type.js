/**
 * object type
 *
 * @flow
 */

/**
 * @pure
 */
function objectType(input: Object): string {
  if('object' !== typeof input) {
    throw new Error(
      `The expected was not a object "${typeof input}", \
maybe you should use typeof ${input} before call this function`
    )
  }

  return ({}).toString.call(input).slice(8, -1).toLowerCase()
}


/// export

export default objectType


/// test

import assert from 'assert'

describe('util objectType()', () => {
  it('should be array', () => {
    assert('array' === objectType([]))
  })

  it('should be regexp', () => {
    assert('regexp' === objectType(/foo/))
  })

  it('should be promise', () => {
    assert('promise' === objectType(Promise.resolve()))
  })

  it('should be null', () => {
    assert('null' === objectType(null))
  })

  it('should throw when expected not a object', () => {
    assert.throws(() => {
      objectType()
    }, /The expected was not a object/)

    assert.throws(() => {
      objectType('foo')
    }, /The expected was not a object/)
  })
})

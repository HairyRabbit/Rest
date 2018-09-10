/**
 * classnames
 *
 * @flow
 */

import { flattenDeep } from 'lodash'


/**
 * @pure
 */
function classnames(...args: Array<?(boolean | string | Array<string>)>): string {
  return flattenDeep(args).filter(Boolean).join(' ')
}


/// export

export default classnames


/// test

import assert from 'assert'

describe('util classnames()', () => {
  it('should be blank string', () => {
    assert('' === classnames())
  })

  it('split by space', () => {
    assert('foo bar' === classnames('foo', 'bar'))
  })

  it('ignore null value', () => {
    assert('foo' === classnames('foo', null))
    assert('foo' === classnames('foo', undefined))
  })

  it('should include array item', () => {
    assert('foo bar baz' === classnames(
      'foo',
      ['bar', 'baz']
    ))
  })

  it('real world', () => {
    assert('foo' === classnames(
      true && 'foo',
      false && 'bar',
      null && 'baz'
    ))
  })
})

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
  return args.filter(Boolean).join(' ')
}

/**
 * @pure
 */
function classnamesDeep(...args: Array<?(boolean | string | Array<string>)>): string {
  return flattenDeep(args).filter(Boolean).join(' ')
}



/// export

export default classnames
export {
  classnamesDeep
}


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

  it('should include array item use deep', () => {
    assert('foo bar baz' === classnamesDeep(
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

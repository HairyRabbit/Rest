/**
 * module-path
 *
 * safe resolve module path
 *
 * @flow
 */

/// code

function modulePath(path: string): ?string {
  try {
    return require.resolve(path)
  } catch(e) {
    return null
  }
}

/// export

export default modulePath


/// test

import assert from 'assert'

describe('Function modulePath()', () => {
  it('should return null', () => {
    assert.deepStrictEqual(
      null,

      modulePath('foo')
    )
  })

  it('should return module path', () => {
    assert.deepStrictEqual(
      'fs',

      modulePath('fs')
    )
  })
})

/**
 * read variable from ENV
 *
 * @flow
 */

/// code

function readEnv(name: string): ?string {
  if(!process.env) return void 0

  return process.env[name]
}


/// export

export default readEnv


/// test

import assert from 'assert'

describe('Function readEnv', () => {
  afterEach(() => {
    delete process.env.FOO
  })

  it('should return var', () => {
    process.env.FOO = 'foo'

    assert.deepStrictEqual(
      'foo',
      readEnv('FOO')
    )
  })

  it('should return null', () => {
    assert.deepStrictEqual(
      undefined,
      readEnv('FOO')
    )
  })
})

/**
 * parse webpackOptions.entry
 *
 * @flow
 */

import { isPlainObject } from 'lodash'
import { objectType } from '../../../util'
import type { Entry } from 'webpack-option-type'


/// code

type Result = {
  name: string,
  entry: string,
  prepends: Array<string>,
}

function parse(entry: Entry, name? = 'main', subtype?: boolean = false): Array<Result> {
  switch(typeof entry) {
    case 'string': {

      return [{
        name,
        entry,
        prepends: []
      }]
    }

    case 'object': {

      if(Array.isArray(entry)) {

        switch(entry.length) {

          case 0:

            throw new Error(
              `The entry should include more then one element`
            )

          case 1:

            return [{
              name,
              entry: entry[0],
              prepends: []
            }]

          default:

            return [{
              name,
              entry: entry.slice(-1)[0],
              prepends: entry.slice(0, -1)
            }]

        }
      } else if(subtype) {

        throw new Error(
          `\
Unknow webpack option.entry[${name}] type "${objectType(entry)}"
The entry[name] type should one of:

  * string
  * Array<string>
  * Function
`
        )

      } else if(isPlainObject(entry)) {

        const acc = []

        for(let key in entry) {
          acc.push(parse(entry[key], key, true)[0])
        }

        return acc

      } else {

        throw new Error(
          `\
Unknow webpack option.entry type "${objectType(entry)}"
The entry type should one of:

  * string
  * Array<string>
  * { [name:string]: string | Array<string> }
  * Function
`
        )

      }
    }

    case 'function': {

      return [{
        name,
        entry,
        prepends: []
      }]

    }

    default: {

      throw new Error(
        `\
Unknow webpack option.entry${subtype ? `[${name}]` : ''} type "${typeof entry}"
The entry type should one of:

  * string
  * Array<string>
  * { [name:string]: string | Array<string> }
  * Function
`
      )

    }
  }
}


/// export

export default parse


/// test

import assert from 'assert'
import sinon from 'sinon'

describe('entryOptionParse()', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('should parse string', () => {
    assert.deepStrictEqual(
      [{
        name: 'main',
        entry: 'foo',
        prepends: []
      }],

      parse('foo')
    )
  })

  it('should parse array', () => {
    assert.deepStrictEqual(
      [{
        name: 'main',
        entry: 'bar',
        prepends: ['foo']
      }],

      parse(['foo', 'bar'])
    )
  })

  it('should parse array only one element', () => {
    assert.deepStrictEqual(
      [{
        name: 'main',
        entry: 'foo',
        prepends: []
      }],

      parse(['foo'])
    )
  })

  it('should parse function', () => {
    const ref = () => 42
    assert.deepStrictEqual(
      [{
        name: 'main',
        entry: ref,
        prepends: []
      }],

      parse(ref)
    )
  })

  it('should parse object', () => {
    assert.deepStrictEqual(
      [{
        name: 'foo',
        entry: 'bar',
        prepends: []
      }],

      parse({
        foo: 'bar'
      })
    )
  })

  it('should parse object with keys', () => {
    assert.deepStrictEqual(
      [{
        name: 'foo',
        entry: 'bar',
        prepends: []
      },{
        name: 'baz',
        entry: 'qux',
        prepends: []
      }],

      parse({
        foo: 'bar',
        baz: 'qux'
      })
    )
  })

  it('should parse object type with array type property', () => {
    assert.deepStrictEqual(
      [{
        name: 'foo',
        entry: 'baz',
        prepends: ['bar']
      }],

      parse({
        foo: ['bar', 'baz']
      })
    )
  })

  it('should parse object with array type property, array only one element', () => {
    assert.deepStrictEqual(
      [{
        name: 'foo',
        entry: 'bar',
        prepends: []
      }],

      parse({
        foo: ['bar']
      })
    )
  })

  // it('should parse object type when some prepends type not string', () => {
  //   assert.throws(
  //     () => new Builder({
  //       entry: {
  //         foo: [new Date(), 'bar']
  //       }
  //     }),
  //     /Array element type should be string/
  //   )
  // })

  // it('should parse entry, null or undefined should pass', () => {
  //   assert.deepStrictEqual(
  //     new Map([]),
  //     new Builder({ }).entry
  //   )
  // })

  it('should throw when parse invaild type', () => {
    assert.throws(
      () => parse(undefined),
      /Unknow webpack option.entry type "undefined"/
    )
  })

  it('should throw when parse invaild object type', () => {
    assert.throws(
      () => parse(new Date()),
      /Unknow webpack option.entry type "date"/
    )
  })
})

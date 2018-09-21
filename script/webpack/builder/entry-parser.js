/**
 * parse webpackOptions.entry
 *
 * @flow
 */

import { isPlainObject } from 'lodash'
import { objectType } from '../../../util'
import type { Entry } from 'webpack-options-type'


/// code

type Result = {
  name: string,
  entry: string,
  prepends: Array<string>,
}

function parse(entry: Entry, name? = 'main', subtype?: boolean = false): Array<Result> {
  switch(typeof entry) {
    case 'string':
    case 'function': {
      return [{
        name,
        entry,
        prepends: []
      }]
    }

    case 'object': {
      if(Array.isArray(entry)) {
        switch(entry.length) {
          case 0: {
            throw new Error(
              `The entry should include more then one element`
            )
          }

          case 1: {
            return [{
              name,
              entry: entry[0],
              prepends: []
            }]
          }

          default: {
            const idx = entry.findIndex(pre => 'string' !== typeof pre)
            if(~idx) {
              const elem = entry[idx]
              throw new Error(
                `\
The entry array should be all the element was string type, but \
the entry${subtype ? `["${name}"]` : ''} prepends[${idx}] type was \
${'object' === typeof elem ? typeof elem : objectType(elem)}`
              )
            }

            return [{
              name,
              entry: entry.slice(-1)[0],
              prepends: entry.slice(0, -1)
            }]
          }
        }
      } else if(subtype) {
        throw new Error(
          `\
Unknow webpack option.entry["${name}"] type "${objectType(entry)}"
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

    default: {
      throw new Error(
        `\
Unknow webpack option.entry${subtype ? `["${name}"]` : ''} type "${typeof entry}"
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

describe('Function entryOptionParse()', () => {
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

  it('should throw when parse empty array', () => {
    assert.throws(
      () => parse([]),
      /The entry should include more then one element/
    )
  })

  it('should parse array when some prepends type not string', () => {
    assert.throws(
      () => parse([null, 'bar']),
      /The entry array should be all the element was string type/
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

  it('should throw when parse invaild type', () => {
    assert.throws(
      () => parse(undefined),
      /Unknow webpack option.entry type "undefined"/
    )
  })

  it('should throw when parse invaild type with subtype', () => {
    assert.throws(
      () => parse(undefined, 'foo', true),
      /Unknow webpack option.entry\["foo"\] type "undefined"/
    )
  })

  it('should throw when parse invaild object type', () => {
    assert.throws(
      () => parse(null),
      /Unknow webpack option.entry type "null"/
    )
  })
})

/**
 * entry parser, parse webpackOptions.entry
 *
 * @todo function type was invaild
 * @flow
 */

import { isPlainObject } from 'lodash'
import { objectType } from '../../../util'
import type { Entry } from './webpack-options-type'
import TplEntryOptionTypeError from './txt/entry-option-type-error.txt'
import TplEntryOptionObjectTypeError from './txt/entry-option-object-type-error.txt'
import TplEntryOptionSubtypeError from './txt/entry-option-subtype-error.txt'
import TplEntryOptionPrependTypeError from './txt/entry-option-prepend-type-error.txt'
import TplEntryOptionEmptyError from './txt/entry-option-empty-array-error.txt'


/// code

type EntryResult = {
  name: string,
  entry: string,
  prepends: Array<string>,
}

type Result =
  | [false, Array<EntryResult>]
  | [true, null]

function parse(entry: Entry, name?: string = 'main', subtype?: boolean = false): Result {
  switch(typeof entry) {
    case 'function': {
      if(subtype) {
        throw new Error(
          TplEntryOptionSubtypeError
            .replace(/\{\{ name \}\}/g, name)
            .replace('{{ entrytype }}', objectType(entry))
        )
      }

      return [true, null]
    }

    case 'string': {
      return [false, [{
        name,
        entry,
        prepends: []
      }]]
    }

    case 'object': {
      /**
       * array type
       */
      if(Array.isArray(entry)) {
        switch(entry.length) {
          /**
           * empty array, throw a error
           */
          case 0: {
            throw new Error(TplEntryOptionEmptyError)
          }

          /**
           * only one element, like string type
           */
          case 1: {
            return [false, [{
              name,
              entry: entry[0],
              prepends: []
            }]]
          }

          /**
           * entry with prepends, check prepends should be
           * non-empty string
           */
          default: {
            const idx = entry.findIndex(pre => 'string' !== typeof pre)
            if(~idx) {
              const elem = entry[idx]
              throw new Error(
                TplEntryOptionPrependTypeError
                  .replace('{{ subtype }}', subtype ? `["${name}"]` : '')
                  .replace('{{ idx }}', idx)
                  .replace('{{ elem }}', elem)
                  .replace('{{ type }}', 'object' === typeof elem
                           ? typeof elem
                           : objectType(elem))
              )
            }

            return [false, [{
              name,
              entry: entry.slice(-1)[0],
              prepends: entry.slice(0, -1)
            }]]
          }
        }
      } else if(subtype) {
        /**
         * if the subtype was true, only string or array type
         * was valid type
         */
        throw new Error(
          TplEntryOptionSubtypeError
            .replace(/\{\{ name \}\}/g, name)
            .replace('{{ entrytype }}', objectType(entry))
        )
      } else if(isPlainObject(entry)) {
        /**
         * valid object type
         */
        const acc = []

        for(let key in entry) {
          /**
           * just fix the [true, null] type
           */
          const sub = parse(entry[key], key, true)[1]
          if(sub) acc.push(sub[0])
        }

        return [false, acc]
      } else {
        /**
         * invalid object type, like RegExp, Date etc..
         */
        throw new Error(
          TplEntryOptionObjectTypeError
            .replace('{{ entrytype }}', objectType(entry))
        )
      }
    }

    default: {
      throw new Error(
        TplEntryOptionTypeError
          .replace('{{ subtype }}', subtype ? `["${name}"]` : '')
          .replace('{{ entrytype }}', typeof entry)
      )
    }
  }
}


/// export

export default parse


/// test

import assert from 'assert'

describe('Function entryOptionParse()', () => {
  it('should parse dynamic entry', () => {
    assert.deepStrictEqual([true, null], parse(() => 'foo'))
  })

  it('should parse string', () => {
    assert.deepStrictEqual(
      [false, [{ name: 'main', entry: 'foo', prepends: [] }]],
      parse('foo')
    )
  })

  it('should parse array', () => {
    assert.deepStrictEqual(
      [false, [{ name: 'main', entry: 'bar', prepends: ['foo'] }]],
      parse(['foo', 'bar'])
    )
  })

  it('should throw when parse empty array', () => {
    assert.throws(() => parse([]), /.*/)
  })

  it('should parse array when some prepends type not string', () => {
    // $FlowFixMe
    assert.throws(() => parse([null, 'bar']), /.*/)
  })

  it('should parse array only one element', () => {
    assert.deepStrictEqual(
      [false, [{ name: 'main', entry: 'foo', prepends: [] }]],
      parse(['foo'])
    )
  })

  it('should parse object', () => {
    assert.deepStrictEqual(
      [false, [{ name: 'foo', entry: 'bar', prepends: [] }]],
      parse({ foo: 'bar' })
    )
  })

  it('should parse object with keys', () => {
    assert.deepStrictEqual(
      [false, [{ name: 'foo', entry: 'bar', prepends: [] },
               { name: 'baz', entry: 'qux', prepends: [] }]],
      parse({ foo: 'bar', baz: 'qux' })
    )
  })

  it('should parse object type with array type property', () => {
    assert.deepStrictEqual(
      [false, [{ name: 'foo', entry: 'baz', prepends: ['bar'] }]],
      parse({ foo: ['bar', 'baz'] })
    )
  })

  it('should parse object with array type property, array only one element', () => {
    assert.deepStrictEqual(
      [false, [{ name: 'foo', entry: 'bar', prepends: [] }]],
      parse({ foo: ['bar'] })
    )
  })

  it('should throw when parse invaild type', () => {
    // $FlowFixMe
    assert.throws(() => parse(undefined), /.*/)
  })

  it('should throw when parse invaild type with subtype', () => {
    // $FlowFixMe
    assert.throws(() => parse(undefined, 'foo', true), /.*/)
  })

  it('should throw when parse function type with subtype', () => {
    // $FlowFixMe
    assert.throws(() => parse(undefined, () => 'foo', true), /.*/)
  })

  it('should throw when parse invaild object type', () => {
    // $FlowFixMe
    assert.throws(() => parse(null), /.*/)
  })
})

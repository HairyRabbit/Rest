/**
 * rule parser, parse webpackOptions.module.rules. if rule
 * can't parsed, the check would be false; if parsed, add
 * `type`, `loaders`, `props` properties to Result
 *
 * @flow
 */

import { isRegExp } from 'lodash'
import type { Rule } from './webpack-options-type'


/// code

export type Result = {
  check: boolean,
  rule: Rule,
  type?: Array<string>,
  loaders?: Array<{ loader: string, options?: Object, name?: string }>,
  options?: Object
}

export default function parse(rules: Array<Rule>): Array<Result> {
  return rules.map(rule => {
    const { test, use, options = {}, ...rest } = rule

    if(!isRegExp(test)) return { check: false, rule }

    const ma = test.source.match(/^\\\.(\w+)(\??)\$$/)
    if(!ma) return { check: false, rule }

    const [_, maf, maq] = ma
    const type = maq ? maf.slice(0, -1) : maf

    if(!use) {
      return {
        check: true,
        rule,
        type,
        loaders: [],
        options: rest
      }
    } else if('string' === typeof use) {
      return {
        check: true,
        rule,
        type,
        loaders: [{
          loader: use,
          options
        }],
        options: rest
      }
    } else if(Array.isArray(use)) {
      return {
        check: true,
        rule,
        type,
        loaders: use.map(u => {
          return 'string' === typeof u
            ? { loader: u, options }
            : { loader: u.loader, options: { ...options, ...u.options } }
        }),
        options: rest
      }
    } else {
      /**
       * parse fail
       */
      return { check: false, rule }
    }
  })
}


/// test

import assert from 'assert'

describe('Function parseRule()', () => {
  it('should parse faild, test not match', () => {
    assert.deepStrictEqual(
      [{ check: false, rule: { test: /foo/ } }],
      parse([ { test: /foo/ } ])
    )
  })

  it('should parse faild, test not RegExp', () => {
    assert.deepStrictEqual(
      [{ check: false, rule: { test: 'foo' } }],
      parse([ { test: 'foo' } ])
    )
  })

  it('should parse faild, use not string or array', () => {
    assert.deepStrictEqual(
      [{ check: false, rule: { test: /\.foo$/, use: {} }}],
      // $FlowFixMe
      parse([{ test: /\.foo$/, use: {} }])
    )
  })

  it('should parse rules without use', () => {
    assert.deepStrictEqual(
      [{ check: true, rule: { test: /\.foo$/ }, type: 'foo', loaders: [], options: {} }],
      parse([ { test: /\.foo$/ } ])
    )
  })

  it('should parse rules string type use', () => {
    assert.deepStrictEqual(
      [{
        check: true,
        rule: { test: /\.js$/, use: 'babel-loader' },
        type: 'js',
        loaders: [{ loader: 'babel-loader', options: {} }],
        options: {}
      }],

      parse([
        { test: /\.js$/, use: 'babel-loader' }
      ])
    )
  })

  it('should parse rules array type use', () => {
    assert.deepStrictEqual(
      [{
        check: true,
        rule: {
          test: /\.css$/,
          use: ['style-loader', { loader: 'css-loader' }]
        },
        type: 'css',
        loaders: [{ loader: 'style-loader', options: {} },
                  { loader: 'css-loader', options: {} }],
        options: {}
      }],

      parse([{
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader' }]
      }])
    )
  })

  it('should parse rules merge options', () => {
    assert.deepStrictEqual(
      [{
        check: true,
        rule: {
          test: /\.css$/,
          include: ['foo'],
          use: [ 'style-loader',
                 { loader: 'css-loader', options: { qux: 'quxx' }}],
          options: { bar: 42 }
        },
        type: 'css',
        loaders: [
          { loader: 'style-loader', options: { bar: 42 } },
          { loader: 'css-loader', options: { bar: 42, qux: 'quxx' } }
        ],
        options: { include: ['foo'] }
      }],

      parse([{
        test: /\.css$/,
        include: ['foo'],
        use: ['style-loader',
              { loader: 'css-loader', options: { qux: 'quxx' }}],
        options: { bar: 42 }
      }])
    )
  })
})

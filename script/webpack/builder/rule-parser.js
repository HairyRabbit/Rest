/**
 * rule parser
 *
 * parse webpackOptions.module.rules
 *
 * @flow
 */

import { isRegExp } from 'lodash'
import type { Rule } from './webpack-options-type'


/// code

type Result = {
  loaders: Array<{ loader: string, options: Object }>,
  props: Object
}

function parse(rules: Array<Rule>): Array<Result> {
  return rules.map(rule => {
    const { use, options = {}, ...rest } = rule

    if('string' === typeof use) {
      return {
        loaders: [{
          loader: use,
          options
        }],
        props: rest
      }
    } else if(Array.isArray(use)) {
      return {
        loaders: [{
          ...use,
          options: {
            ...use.options,
            ...options
          }
        }],
        props: rest
      }
    } else {
      throw new Error(
        `Unknow module.rules.use type`
      )
    }
  })
}


/// export

export default parse


/// test

import assert from 'assert'

describe('Function ruleParse()', () => {

})

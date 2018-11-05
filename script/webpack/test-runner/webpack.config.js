/**
 * webpack config
 */

import * as path from 'path'
import Builder from '../../../lib/webpack-builder'


/// code

export default Builder('lodash,nodelib', { nodelib: { libraryName: 'webpack-test-runner' } })
  .setContext(__dirname)
  .setOutput(path.resolve('lib'))
  .transform()

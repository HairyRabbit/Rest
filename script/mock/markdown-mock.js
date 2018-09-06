/**
 * mock markdown file
 */

import path from 'path'
import ignoreRegister from 'ignore-styles'


const exts = ['.md']

function register(module, filename) {
  const ext = path.extname(filename)
  if('.md' === ext) {
    module._compile(mock(), filename)
  }
}

function mock() {
  return 'module.exports = () => null'
}


/// export

export {
  exts,
  register
}
export default mock

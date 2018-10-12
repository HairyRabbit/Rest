/**
 * style file stub
 */

import fs from 'fs'
import path from 'path'
import ignoreRegister from 'ignore-styles'

const exts = ['.css']

function register(module, filename) {
  const ext = path.extname(filename)
  if(~exts.indexOf(ext)) {
    module._compile(mock(), filename)
  }
}

function mock(): { string: string } {
  return {}
}


/// export

export {
  exts,
  register
}
export default mock

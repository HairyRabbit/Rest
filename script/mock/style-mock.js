/**
 * style file stub
 */

import fs from 'fs'
import path from 'path'
import ignoreRegister from 'ignore-styles'
import postcss from 'postcss'

const exts = ['.css']

function register(module, filename) {
  const ext = path.extname(filename)
  if(~exts.indexOf(ext)) {
    const source = postcss.parse(
      fs.readFileSync(filename),
      { from: filename }
    ).nodes
          .filter(node => 'rule' === node.type)
          .map(node => node.selector.substr(1))
          .reduce((acc, curr) => { acc[curr] = curr; return acc }, {})

    module.exports = source
  }
}

function mock() {
  return {}
}


/// export

export {
  exts,
  register
}
export default mock

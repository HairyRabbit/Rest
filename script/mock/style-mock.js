/**
 * style file stub
 */

import fs from 'fs'
import path from 'path'
import register from 'ignore-styles'
import postcss from 'postcss'


function mock(module, filename) {
  const ext = path.extname(filename)
  if(~['.css', '.scss', '.sass', '.less'].indexOf(ext)) {
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


/// export

export default () => register(undefined, mock)

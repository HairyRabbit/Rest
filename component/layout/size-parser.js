/**
 * size-parser
 *
 * parse size value
 *
 * @flow
 */

/// code

function parseSize(size: string): Array<{ flex: string }> {
  return size.split(':').map(s => {
    const n = Number(s)
    if(!isNaN(n)) return { flex: `${n} 0 auto` }
    return { flex: `0 0 ${s}` }
  })
}


/// export

export default parseSize

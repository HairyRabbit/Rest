/**
 * sourcemap-path-formatter
 *
 * format sourcemap path, convert to absoulte path
 *
 * @flow
 */


/// code

function format(info): string {
  const prepend = 'file:///'
  const fmt = 'win32' === process.platform
        ? path.resolve(info.resourcePath)
              .replace(/\\/g, '\/')
              .replace(/(\w):/, (_, a) => a.toUpperCase() + ':')
        : path.resolve(info.resourcePath)

  return info.allLoaders.length && !info.allLoaders.startsWith('css')
    ? prepend + fmt + `?${info.hash}`
    : prepend + fmt
}


/// export

export default format

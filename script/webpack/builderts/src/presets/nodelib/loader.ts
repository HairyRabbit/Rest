/**
 * pitch loader for prepend boot script to the main entry
 */

import loaderUtils from 'loader-utils'


/// code

export function pitch(remainingRequest) {
  if (!this.resourceQuery) return
  const query = loaderUtils.parseQuery(this.resourceQuery)
  if (!(query && query.boot)) return
  const req = loaderUtils.stringifyRequest(this, '!!' + remainingRequest)

  return `
  function main() {
    const main = require(${req})
    main.default()
  }

  if(module.hot) {
    module.hot.accept(${req}, main)
  }

  main()
  `
}

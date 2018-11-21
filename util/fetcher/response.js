/**
 * handle response
 *
 * @flow
 */

import { isFunction } from 'lodash'
import FetcherError from './error-type'

/// code

export type Options = {
  parser?: Response => any
}

export default function response({
  parser = parseByType
}: Options = {}): * {
  if(!isFunction(parser)) {
    throw new Error(`Fetcher response parser type invalid`)
  }

  return function response1(res: Response): Promise<*> {
    const { ok, status, headers } = res

    /**
     * status code not be 2XX
     */
    if(!ok) {
      let type = ''

      if(status >= 400 && status < 500) {
        /**
         * handle 4XX errors
         */
        throw new FetcherError({
          type: 3,
          error: new Error(`Handle ${status} code`)
        })

      } else if(status >= 500) {
        /**
         * handle 5XX errors.
         */
        throw new FetcherError({
          type: 4,
          error: new Error(`Handle ${status} error`)
        })

      } else {
        /**
         * not 4XX or 5XX? this should never throw
         */
        throw new FetcherError({
          type: 6,
          error: new Error(`Status code "${status}" not in range`)
        })
      }
    }

    /**
     * handle parse error
     */
    return parser(res).catch(error => {
      throw new FetcherError({
        type: 5,
        error: new Error(`Can't parse data`)
      })
    })
  }
}

/**
 * Response Object build-in parsers:
 *
 * - arrayBuffer
 * - blob
 * - formData
 * - json
 * - text
 */
function parseByType(res: Response): Promise<*> {
  const type = res.headers.get('Content-Type') || 'plain/text'
  switch(type) {
    case 'application/json':
      return res.json()
    case 'image/png':
    case 'image/jpg':
    case 'image/gif':
    case 'image/jpeg':
    case 'text/csv':
    case 'application/xml':
    case 'text/xml':
      // return res.text().then(res => {
      //   return  new DOMParser().parseFromString(res, 'application/xml')
      // })
    case 'plain/text':
      return res.text()
    default:
      throw new Error(`Unsupports parse type "${type}"`)
  }
}

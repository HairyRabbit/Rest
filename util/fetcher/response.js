/**
 * handle response
 *
 * @flow
 */

import FetcherError from './error-type'

/// code

function response(res: Response): * {
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

  const mime = headers.get('Content-Type')
  if(!mime) throw new FetcherError({
    type: 5,
    error: new Error(`No "Content-Type" header set`)
  })

  return parse(mime, res).catch(error => {
    throw new FetcherError({
      type: 5,
      error: new Error(`Can't parse data`)
    })
  })
}

/**
 * res.arrayBuffer()
 * res.blob()
 * res.formData()
 * res.json()
 * res.text()
 */
function parse(type: string, res: Response): Promise<*> {
  switch(type) {
    case 'application/json':
      return res.json()
    case 'plain/text':
      return res.text()
    case 'image/png':
    case 'image/jpg':
    case 'image/gif':
    case 'image/jpeg':
    case 'text/csv':
    case 'application/xml':
    case 'text/xml':
      return res.text().then(res => {
        return  new DOMParser().parseFromString(res, 'application/xml')
      })
    default:
      throw new Error(`Unsupports parse type "${type}"`)
  }
}



/// export

export default response

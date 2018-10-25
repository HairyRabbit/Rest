/**
 * fetcher, warp fetch for high level api. the fetcher do:
 *
 * 1. filter request data
 * 2. parse response data
 * 3. report errors
 *
 * @flow
 */


/// code

/**
 * custom error types:
 *
 * 1. can't connect, no networks.
 * 2. internal error, code bugs, should be never fire.
 * 3. handle 4XX errors, like 400, 401, 403, mostly client code bugs
 * 4. handle 5XX errors, like 500. the service not work at moment.
 * 5. data parse error, can't parse json or xml etc..
 * 6. fetcher internal error, this tool has some bug, should report
 */
type ErrorType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6

type RequestErrorOptions = {
  type: ErrorType,
  error: Error
}

export class RequestError extends Error {
  message: string
  error: Error
  type: ErrorType

  constructor({ type, error }: RequestErrorOptions, ...args: Array<*>) {
    super(...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError)
    }

    this.type = type
    this.error = error
    this.message = mapErrorTypeToMessage(type)
  }
}

function mapErrorTypeToMessage(type: ErrorType): string {
  switch(type) {
    case 1: return lang.util.request.browser_internal_error
    case 2: return lang.util.request.client_internal_error
    case 3: return lang.util.request.client_runtime_error
    case 4: return lang.util.request.server_runtime_error
    case 5: return lang.util.request.data_parse_error
    case 6: return lang.util.request.request_internal_error
    default:
      throw new Error(
        `RequestError type "${type}" was invaild`
      )
  }
}

type Options = {
  endpoint?: string,
  mock?: boolean,
  mockError?: RequestError
}

const default_endpoint = '/' + (process.env.API_ENDPOINT || 'api') + '/'

export default function request<D>(name: string,
                                   dispatch: Dispatch<D>,
                                   { endpoint = default_endpoint,
                                     mock = process.env.API_MOCK && '0' !== process.env.API_MOCK,
                                     mockError }: Options = {}): * {
  return function request1(uri: RequestInfo,
                           fetchOptions: RequestOptions): Promise<*> {

    dispatch(action.request(name))


    /**
     * if working on development mode, usually use mock data for request.
     * disabled on production mode
     */

    // if('production' !== process.env.NODE_ENV && mock) {
    //   log.debug('app', `${name}.request`, `fetch works on mock mode`)
    //   log.debug('app', `${name}.request`, `mock data from "${process.env.CONTEXT || './'}/mock/${name.replace(/\/[^]+/g, '')}.js"`)

    //   return new Promise((res) => {
    //     setTimeout(() => {
    //       Promise.resolve(require(`../mock/${name.replace(/\/[^]+/g, '')}.js`).default())
    //         .then(dispatchData(dispatch, name))
    //         .then(res)
    //     }, 200)
    //   })
    // }

    return fetch(makeUrl(endpoint, uri), fetchOptions)
      .then(dataParse)
      .then(dispatchData(dispatch, name))
      .catch(handleError)
      .catch(dispatchError(dispatch, name))
  }
}

function makeUrl(endpoint: string, uri: RequestInfo): string {
  if('string' !== typeof uri) {
    return uri.toString()
  }

  if(/^\//.test(uri)) {
    return endpoint + uri.substr(1)
  }

  return endpoint + uri
}


function dataParse(res: Response): * {
  const { ok, status, headers } = res
  if(!ok) {
    let type = ''
    if(status >= 400 && status < 500) {
      /**
       * handle 4XX errors. Most of them are user behavior,
       * also the client code bug.
       */
      const message = `Handle ${status} error`
      log.error('app', 'request', message)
      throw new RequestError({
        type: 3,
        error: new Error(message)
      })

    } else if(status >= 500) {
      /**
       * handle 5XX errors. often the server bug, should report
       * to logger server.
       */
      const message = `Handle ${status} error`
      log.error('app', 'request', message)
      throw new RequestError({
        type: 4,
        error: new Error(message)
      })

    } else {
      /**
       * this should never throw
       */
      const message = `Response not ok, but status: "${status}" not in range`
      log.debug('app', 'request', message)
      throw new RequestError({
        type: 6,
        error: new Error(message)
      })
    }
  }

  return res.json().catch(error => {
    const message = `can't parse JSON`
    log.error('app', 'request', message)
    throw new RequestError({
      type: 5,
      error: error
    })
  })
}

function handleError(err: Error | RequestError): void {
  /**
   * pass ResponseError
   */
  if(!err instanceof Error) {
    throw err
  }

  /**
   * handle CSP or network connect error
   */
  if(/Failed to fetch/.test(err.message)) {
    log.error('app', 'request', `can't fetch`)
    throw new RequestError({
      type: 1,
      error: err
    })
  }

  log.error('app', 'request', `something wrong with fetch`)
  throw new RequestError({
    type: 2,
    error: err
  })
}

function dispatchError(dispatch, name: string) {
  return function dispatchError1(error: RequestError): void {
    log.error('app', `${name}.request`, 'request failed')
    dispatch(action.failure(name, error.message))
  }
}

function dispatchData(dispatch, name: string) {
  return function dispatchData1(data): void {
    log.info('app', `${name}.request`, 'request successful')
    // log.debug('app', `${name}.request`, JSON.stringify(data, null, 2))
    dispatch(action.success(name, data))
  }
}


/**
 * test
 */

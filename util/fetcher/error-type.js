/**
 * fetcher error types:
 *
 * 1. can't connect, no networks.
 * 2. internal error, code bugs, should be never fire.
 * 3. handle 4XX errors, like 400, 401, 403, mostly client code bugs
 * 4. handle 5XX errors, like 500. the service not work at moment.
 * 5. data parse error, can't parse json or xml etc..
 * 6. fetcher internal error, this tool has some bug, should report
 *
 * @flow
 */


/// code

export type ErrorType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6

type Options = {
  type: ErrorType,
  error: Error
}

class FetcherError extends Error {
  message: string
  error: Error
  type: ErrorType

  constructor({ type, error }: Options, ...args: Array<*>) {
    super(...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError)
    }

    this.type = type
    this.error = error
    this.message = mapToMessage(type)
  }
}

function mapToMessage(type: ErrorType): string {
  switch(type) {
    case 1: return 'network error'
    case 2: return 'internal error'
    case 3: return 'client error'
    case 4: return 'server error'
    case 5: return 'parse error'
    case 6: return 'fetcher error'
    default:
      throw new Error(
        `FetcherError type "${type}" was invaild`
      )
  }
}


/// export

export default FetcherError

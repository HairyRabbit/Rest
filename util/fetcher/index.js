/**
 * fetcher, warp fetch/xhr for high level api.
 *
 * ```js
 * api.get('/user', )
 * ```
 * 1. filter request data
 * 2. parse response data
 * 3. report errors
 *
 * @flow
 */

import request from './request'
import response from './response'


/// code

export function fetcher(url: string, options: mixed = {}) {
  return fetch(request(url, options))
    .then(response(options))
}

export function createFetcher(options = {}): * {
  function wrapFetcher(url: string, options1 = {}) {
    return fetcher(url, { ...options, ...options1 })
  }

  wrapFetcher.get = fetchByMethod('get', options)
  wrapFetcher.post = fetchByMethod('post', options)
  wrapFetcher.put = fetchByMethod('put', options)
  wrapFetcher.patch = fetchByMethod('patch', options)
  wrapFetcher.delete = fetchByMethod('delete', options)

  return wrapFetcher
}

function fetchByMethod(method, options = {}) {
  return function fetchByMethod1(url, options1 = {}) {
    return fetcher(url, { method, ...options, ...options1 })
  }
}

export default createFetcher({
  base: process.env.FETCH_BASE || location.origin
})


/// test

import assert from 'assert'

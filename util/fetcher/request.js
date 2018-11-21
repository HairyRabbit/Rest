/**
 * fetcher request
 *
 * @flow
 */


/// code

export type Options = {
  base?: string,
  type?: 'json' | 'form',
  method?: string,
  parser?: parseByType,
  params?: { [key: string]: string },
  body?: { [key: string]: string }
}

export default function request(url: string, {
  base = 'http://location',
  type = 'json',
  parser = parseByType,
  method = 'GET',
  params,
  body,
  ...rest
}: Options = {}): * {
  /**
   * get url patch
   */
  let purl = url
  if(!url.match(/^[^:]+:\/{2}/)) {
    purl = base + (url.startsWith('/') ? url : '/' + url)
  }

  const opt = new URL(purl)
  const qs = opt.searchParams

  /**
   * combine search params
   */
  if(params) {
    for(let key in params) {
      const val = params[key]
      if(undefined !== val) {
        qs.set(key, val)
      }
    }
  }

  const options = {
    method,
    headers: rest.headers,
    ...rest
  }

  /**
   * parse data and set content-type header
   */
  if('GET' !== method && body) {
    const [ header, data ] = parser(body)
    options.headers['Content-Type'] = header
    options.body = data
  }

  console.log(params, qs.toString(), options)
  return new Request(opt.toString(), options)
}

function parseByType(type, data): [string, string] {
  switch(type) {
    case 'form': {
      const qs = new URLSearchParams()
      for(let key in data) {
        qs.set(key, data[key])
      }
      return ['application/x-www-form-urlencoded', qs.toString()]
    }
    case 'json': {
      return ['application/json', JSON.string(data)]
    }
    default: {
      throw new Error(`Unsupport type "${type}"`)
    }
  }
}

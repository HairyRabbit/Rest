/**
 * url-replacer
 *
 * replace url use history, some browser can't supports custom
 * 404 page, e.g. IE, QQ Browser. So need replace current history
 * from the "hfb" url search param.
 *
 * @flow
 */

import createHistory from 'history/createBrowserHistory'


/// code

function replaceUrl(ctx: Object): * {
  const url = new URL(location).searchParams.get('hfb')

  if(url) {
    const history = createHistory()
    history.replace(url, {})
  }

  return ctx
}


/// export

export default replaceUrl

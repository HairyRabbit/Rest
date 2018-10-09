/**
 * replace url use history
 *
 * @flow
 */

import createHistory from 'history/createBrowserHistory'


/// code

function replaceUrl(ctx) {
  const url = new URL(location).searchParams.get('hfb')
  if(url) {
    const history = createHistory()
    history.replace(url, {})
  }
  return ctx
}


/// export

export default replaceUrl

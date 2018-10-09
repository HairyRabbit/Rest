/**
 * initial scripts
 *
 * @flow
 */

import replaceUrl from './url-replacer'


/// code

function initial(ctx = {}) {
  return Promise.resolve(ctx)
    .then(replaceUrl)
}


/// export

export default initial

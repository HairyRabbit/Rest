/**
 * github pages fallback plugin rewrite location scripts,
 * add by GithubPagesFallbackPlugin
 *
 * @sideEffects
 */


(function(l) {
  var segmentCount = DOMAIN
  l.replace(
    l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
      l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
      (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
  )
})(window.location)

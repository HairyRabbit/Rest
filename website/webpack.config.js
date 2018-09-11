import path from 'path'
import webpack from '../script/webpack/builder'
import GithubPagesFallbackPlugin from '../script/webpack/github-pages-fallback-plugin'

export default webpack()
  .setContext(__dirname)
  .setOutput(path.resolve('docs'))
  .setLoader('markdown', 'md', [
    'babel-loader?cacheDirectory',
    {
      name: path.resolve('script/webpack/markdown-loader.js'),
      options: {
        components: {
          root: children => `<div className={style.main}>${children}</div>`,
          h1: children => `<h1 className={style.header1}>${children}</h1>`,
          h2: children => `<h2 className={style.header2}>${children}</h2>`,
          h3: children => `<h3 className={style.header3}>${children}</h3>`,
          h4: children => `<h4 className={style.header4}>${children}</h4>`,
          h5: children => `<h5 className={style.header5}>${children}</h5>`,
          h6: children => `<h6 className={style.header6}>${children}</h6>`,
          code: children => `<pre className={style.codeblock}>${children}</pre>`
        }
      }
    }
  ])
  .setPlugin('ghfallback', GithubPagesFallbackPlugin)
  .set('resolve.alias.~component', path.resolve('component'))
  .set('resolve.alias.~style', path.resolve('style'))
  .setLib('@rabbitcc/faker')
  .export()

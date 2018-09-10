import path from 'path'
import webpack from '../script/webpack/builder'
import SPAGithubPagesFallbackPlugin from '../script/webpack/spa-github-pages-fallback-plugin'

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
  .setPluginOptions('html', { filename: '404.html' })
  .set('resolve.alias.~component', path.resolve('component'))
  .set('resolve.alias.~style', path.resolve('style'))
  .set('serve', {
    host: '0.0.0.0',
    port: 8080,
    hotClient: {
      host: {
        server: '0.0.0.0',
        client: '127.0.0.1'
      },
      port: 8081
    }
  })
  .export()

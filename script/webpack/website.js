/**
 * configure for website build
 */

import path from 'path'
import defaultOptions, { createRules }  from './options'

const env = process.env.NODE_ENV

defaultOptions.module.rules = createRules({
  test: /\.md$/,
  use: [
    'babel-loader',
    {
      loader: path.resolve('script/webpack/markdown-loader.js'),
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
  ]
})

defaultOptions.resolve.alias = {
  '~component': path.resolve('component'),
  '~style': path.resolve('style')
}


defaultOptions.context = path.resolve('website')
console.log(defaultOptions)

export default defaultOptions

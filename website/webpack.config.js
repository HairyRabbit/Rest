/**
 * webpack config
 */

import path from 'path'
import webpack from '../script/webpack/builder/index.js'
import markdownLoader from '../script/webpack/markdown-loader'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackBundleSizeAnalyzerPlugin } from 'webpack-bundle-size-analyzer'
import BundleAnalyzePlugin from '../script/webpack/bundle-analyze-plugin'

export default webpack('spa', {
  gcssEntry: [
    path.resolve(__dirname, '../style/main.css'),
    path.resolve(__dirname, 'style.css'),
    /node_modules/
  ]
})
  .setContext(__dirname)
  .setOutput(path.resolve('docs'))
  .setRuleLoader('md', 'babel-loader', {
    options: {
      cacheDirectory: true
    }
  })
  .setRuleLoader('md', 'markdown-loader', {
    name: path.resolve(__dirname, '../script/webpack/markdown-loader'),
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
  })
  .setRuleLoader('img', 'url-loader', {
    options: {
      limit: 4096
    }
  })
  .setRuleLoader('img', 'image-webpack-loader', {
    options: {

    }
  })
  .setRuleTypes('img', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])
  .set('resolve.alias.~component', path.resolve('component'))
  .set('resolve.alias.~style', path.resolve('style'))
  .transform()

/**
 * webpack config
 */

import path from 'path'
import webpack from 'webpack'
import Builder from '../script/webpack/builder/index.js'
import markdownLoader from '../script/webpack/markdown-loader'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackBundleSizeAnalyzerPlugin } from 'webpack-bundle-size-analyzer'
import BundleAnalyzePlugin from '../script/webpack/bundle-analyze-plugin'

export default Builder('icon,spa', {
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
        h2: children => `<Header>${children}</Header>`,
        h3: children => `<h3 className={style.header3}>${children}</h3>`,
        h4: children => `<h4 className={style.header4}>${children}</h4>`,
        h5: children => `<h5 className={style.header5}>${children}</h5>`,
        h6: children => `<h6 className={style.header6}>${children}</h6>`,
        code: children => `<div className={style.codeblock}>${children}</div>`,
        inlineCode: children => `<code className={style.inlinecode}>{\`${children}\`}</code>`,
        link: (href, children) => `<a className={style.link} href="${href}">${children}</a>`
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
  .setRuleOption('img', 'include', path.resolve(__dirname, 'assert'))
  .setRuleOption('icon', 'exclude', path.resolve(__dirname, 'assert'))
  .set('resolve.alias.~component', path.resolve('component'))
  .set('resolve.alias.~style', path.resolve('style'))
  .set('resolve.alias.@style', path.resolve('style'))
  .set('resolve.alias.~util', path.resolve('util'))
  .setPlugin('env', webpack.DefinePlugin, {
    'process.env.LAYOUT_SIZE_PATTERN_ENABLE': JSON.stringify('1')
  })
  .transform()

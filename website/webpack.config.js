import path from 'path'
import webpack from '../script/webpack/builder/index.js'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackBundleSizeAnalyzerPlugin } from 'webpack-bundle-size-analyzer'
import BundleAnalyzePlugin from '../script/webpack/bundle-analyze-plugin'

console.log(
  webpack()
    .setContext(__dirname)
    .setRuleLoader('js', 'babel-loader')
    .setRuleLoader('css', 'style-loader')
    .setRuleLoader('css', 'css-loader')
    .set('resolve.alias.~component', path.resolve('component'))
    .set('devServer.contentBase', __dirname)
    .set('devServer.historyApiFallback', true)
    .transform()
)

export default webpack()
  .setContext(__dirname)
  // .setContext(__dirname)
  // .setOutput(path.resolve('docs'))
  // .setLoader('markdown', 'md', [
  //   'babel-loader?cacheDirectory',
  //   {
  //     name: path.resolve('script/webpack/markdown-loader.js'),
  //     options: {
  //       components: {
  //         root: children => `<div className={style.main}>${children}</div>`,
  //         h1: children => `<h1 className={style.header1}>${children}</h1>`,
  //         h2: children => `<h2 className={style.header2}>${children}</h2>`,
  //         h3: children => `<h3 className={style.header3}>${children}</h3>`,
  //         h4: children => `<h4 className={style.header4}>${children}</h4>`,
  //         h5: children => `<h5 className={style.header5}>${children}</h5>`,
  //         h6: children => `<h6 className={style.header6}>${children}</h6>`,
  //         code: children => `<pre className={style.codeblock}>${children}</pre>`
  //       }
  //     }
  //   }
  // ])
// .setPlugin('bundleAnalyzer', BundleAnalyzePlugin)
  .setRuleLoader('js', 'babel-loader')
  .setRuleLoader('css', 'style-loader')
  .setRuleLoader('css', 'css-loader')
  .set('resolve.alias.~component', path.resolve('component'))
  .set('resolve.alias.~style', path.resolve('style'))
  .set('devServer.contentBase', __dirname)
  .set('devServer.historyApiFallback', true)
  // .setLib('@rabbitcc/faker')
  // .inspect()
  // .export()
  .transform()

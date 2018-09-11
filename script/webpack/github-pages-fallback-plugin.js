/**
 * github-pages-fallback-plugin
 *
 * a webpack plugin generate a custom 404.html file to mock
 * spa history fallback feature
 *
 * @link [spa-github-pages](https://github.com/rafrex/spa-github-pages)
 * @flow
 */


import fs from 'fs'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'


/// code

class GithubPagesFallbackPlugin {
  constructor({ domain, ...options }) {
    this.domain = domain
    this.options = options
  }

  apply(compiler) {
    const webpackOptions = compiler.options

    compiler.options.entry.main.unshift(
      path.resolve(__dirname, './github-pages-fallback-entry.js')
    )

    const script = fs.readFileSync(
      path.resolve(__dirname, './github-pages-fallback-script.js'),
      'utf-8'
    ).replace(/DOMAIN/, this.domain ? 0 : 1)

    new HtmlWebpackPlugin({
      title: '404',
      filename: '404.html',
      inject: false,
      template: HtmlWebpackTemplate,
      chunks: [],
      headHtmlSnippet: `<script>${script}</script>`,
      ...this.options
    }).apply(compiler)
  }
}


/// export

export default GithubPagesFallbackPlugin

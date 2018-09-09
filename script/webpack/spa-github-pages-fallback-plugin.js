/**
 * A plugin generate custom 404.html used for mock server history fallback
 *
 * @flow
 */

import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'

class SPAGithubPagesFallbackPlugin {
  constructor({ context, ...options } = {}) {
    this.context = context
    this.options = options
  }

  apply(compiler) {
    const webpackOptions = compiler.options

    // compiler.apply()

    new HtmlWebpackPlugin({
      inject: false,
      title: '404',
      filename: '404.html',
      template: HtmlWebpackTemplate,
      chunks: [],
      scripts: [

      ],
      ...this.options
    }).apply(compiler)
  }
}


/// export

export default SPAGithubPagesFallbackPlugin

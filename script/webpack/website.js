/**
 * configure for website build
 */

import fs from 'fs'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin  from 'mini-css-extract-plugin'
import postcssPresetEnv from 'postcss-preset-env'

const env = process.env.NODE_ENV

export default {
  mode: env,
  entry: {
    main: [
      path.resolve('website/index.js')
    ]
  },
  output: {
    path: path.resolve('docs'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    },{
      test: /\.css$/,
      exclude: [path.resolve('node_modules')],
      use: [
        // 'style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader?importLoaders=1&modules',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [
              postcssPresetEnv()
            ],
            options: {}
          }
        }
      ]
    },{
      test: /\.css$/,
      include: [path.resolve('node_modules')],
      use: [
        // 'style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader?importLoaders=1',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [
              postcssPresetEnv()
            ],
            options: {}
          }
        }
      ]
    },{
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
    }]
  },
  resolve: {
    alias: {
      '~component': path.resolve('component'),
      '~style': path.resolve('style')
    },
    unsafeCache: true,
    extensions: ['.js']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Rest framework & scaffold'
    })
  ]
}

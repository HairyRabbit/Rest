/**
 * style preset, support features:
 *
 * 1. css modules by default, non-modules(named "gcss") also works fine
 * 2. sass supports and autoprefix by postcss
 * 3. hmr for development mode
 * 4. minify code for production mode
 *
 * "gcss" means global css
 *
 * @todo add vendor.css to index.html file
 * @todo add postcss api
 * @todo "CSS Block" integrate
 * @todo supports disable "CSS Modules" feature
 * @todo add more control options
 * @flow
 */

import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
// import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import type { Condition } from '../webpack-options-type'


/// code

export type Options = {
  gcssEntry?: Condition,
  disableGuessGcss?: boolean
}

export default function preset(builder: *): * {
  const {
    gcssEntry,
    disableGuess,
    disableGuessGcss
  } = builder.options.style || {}

  builder
    .setRuleTypes('css', ['css', 'scss'])
    .setRuleLoader('css', 'cache-loader', {
      options: {
        cacheIdentifier: 'style'
      }
    })
    .setRuleLoaderDev('css', 'style-loader')
    .setRuleLoaderProd('css', 'style-loader', {
      name: MiniCssExtractPlugin.loader
    })
    // .setRuleLoader('css', 'style-loader', {
    //   name: ExtractCssChunks.loader
    // })

  setupLoader(builder, 'css')
  setupSourceMap(builder, 'css')
  setupCss(builder, 'css')
  setupPostcss(builder, 'css')
  setupSass(builder, 'css')

  /**
   * setup css-loader to supports module
   */
  builder
    .setRuleLoaderOption('css', 'css-loader', 'modules', true)
    .setRuleLoaderOptionDev('css', 'css-loader', 'localIdentName', '[local]-[hash:base64:5]')
    .setRuleLoaderOptionProd('css', 'css-loader', 'localIdentName', '[hash:base64:5]')


  /**
   * setup gcss, should set "gcssEntry" options,
   * if not, guess from context by default. guess should
   * set "disableGuessGcss" or "disableGuess" to true.
   *
   * the default search file was "CONTEXT/src/style.css"
   */
  if(gcssEntry) {
    buildGCSS(gcssEntry)
  } else {
    if(disableGuessGcss || disableGuess) return

    builder.jobs.push(() => {
      const _gcssEntry = guessGCSSEntry(builder.context)
      if(!_gcssEntry) return
      buildGCSS(_gcssEntry)
    })
  }

  /**
   * when gcssEntry was set, setup gcss rule:
   *
   * - add gcss rule
   * - add "exclude" options to css rule
   * - add "include" options to gcss rule
   */
  function buildGCSS(gcssEntry: Condition): void {
    builder
      .setRuleOption('css', 'exclude', gcssEntry)
      .setRuleOption('gcss', 'include', gcssEntry)
      .setRuleTypes('gcss', ['css'])
      .addEntryCommonPrependProd(gcssEntry)
      .setRuleLoader('css', 'cache-loader', {
        options: {
          cacheIdentifier: 'style-global'
        }
      })
      .setRuleLoaderDev('gcss', 'style-loader')
      .setRuleLoaderProd('gcss', 'file-loader', {
        options: {
          name: 'vendor.[md5:hash:hex:20].css'
        }
      })
      .setRuleLoaderProd('gcss', 'extract-loader')

    setupLoader(builder, 'gcss')
    setupSourceMap(builder, 'gcss')
    setupCss(builder, 'gcss')
    setupPostcss(builder, 'gcss')
    setupSass(builder, 'gcss')
  }

  /**
   * set plugins for optimization:
   *
   * - MiniCssExtractPlugin - extract css file to one
   * - OptimizeCssAssetsPlugin - apply "cssnano"
   */
  builder
    .setPluginProd('css', MiniCssExtractPlugin, {
      filename: '[name].[contenthash].css'
    })
    // .setPlugin('css', ExtractCssChunks, {
    //   filename: "[name].[contenthash].css",
    //   hot: true,
    //   orderWarning: true,
    //   reloadAll: true,
    //   cssModules: true
    // })
    // .setPlugin('css-chunks', webpack.optimize.LimitChunkCountPlugin, {
    //   maxChunks: 1
    // })
    .setPluginProd('cssmin', OptimizeCSSAssetsPlugin, {
      cssProcessorOptions: {
        map: {
          inline: false,
          annotation: false
        }
      },
      cssProcessorPluginOptions: {
        preset: ['advanced', {
          discardComments: {
            removeAll: true
          }
        }]
      },
      canPrint: true
    })
    .setProd('optimization.splitChunks.cacheGroups.style', {
      name: 'style',
      test: /\.css$/,
      chunks: 'all',
      enforce: true
    })


  /**
   * setup loaders:
   *
   * - style-loader
   * - css-loader
   * - postcss-loader
   * - sass-loader
   */
  function setupLoader(builder: *, name: string): void {
    builder
      .setRuleLoader(name, 'css-loader')
      .setRuleLoader(name, 'postcss-loader')
      .setRuleLoader(name, 'sass-loader')
  }

  /**
   * set source map for dev
   */
  function setupSourceMap(builder: *, name: string): void {
    builder
      .setRuleLoaderOptionDev(name, 'style-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'css-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'postcss-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'sass-loader', 'sourceMap', true)
  }

  function setupCss(builder: *, name: string): void {
    builder
      .setRuleLoaderOption(name, 'css-loader', 'importLoaders', 2)
  }

  function setupPostcss(builder: *, name: string): void {
    builder
      .setRuleLoaderOption(name, 'postcss-loader', 'options', {})
      .setRuleLoaderOption(name, 'postcss-loader', 'plugins', [
        postcssPresetEnv()
      ])
  }

  /**
   * @todo env injection
   */
  function setupSass(builder: *, name: string): void {
    builder
      .setRuleLoaderOption(name, 'sass-loader', 'data', `$env: ${process.env.NODE_ENV};`)
  }

  return builder
}

function guessGCSSEntry(context: string): ?string {
  const gcssFilePath = path.resolve(context, 'src/style.css')
  return fs.existsSync(gcssFilePath) ? gcssFilePath : null
}

export const dependencies = [
  'css-loader',
  'style-loader',
  'postcss-loader',
  'sass-loader',
  'extract-loader',
  'file-loader',
  'mini-css-extract-plugin',
  'optimize-css-assets-webpack-plugin',
  'postcss-preset-env'
]

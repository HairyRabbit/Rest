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
 * @todo "CSS Block" integrate
 * @todo supports disable "CSS Modules" feature
 * @todo add more control options
 * @flow
 */

import fs from 'fs'
import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import typeof Builder from '../builder'
import type { Condition } from '../webpack-options-type'


/// code

export type Options = {
  gcssEntry?: Condition,
  disableGuessGcss?: boolean
}

function preset(builder: Builder): Builder {
  const {
    gcssEntry,
    disableGuess,
    disableGuessGcss
  } = builder.options

  builder
    .setRuleLoaderDev('css', 'style-loader')
    .setRuleLoaderProd('css', 'style-loader', {
      name: MiniCssExtractPlugin.loader
    })
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
    .set('optimization.splitChunks.cacheGroups.style', {
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
  function setupLoader(builder: Builder, name: string): void {
    builder
      .setRuleLoader(name, 'css-loader')
      .setRuleLoader(name, 'postcss-loader')
      .setRuleLoader(name, 'sass-loader')
  }

  /**
   * set source map for dev
   */
  function setupSourceMap(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOptionDev(name, 'style-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'css-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'postcss-loader', 'sourceMap', true)
      .setRuleLoaderOption(name, 'sass-loader', 'sourceMap', true)
  }

  function setupCss(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOption(name, 'css-loader', 'importLoaders', 2)
  }

  function setupPostcss(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOption(name, 'postcss-loader', 'options', {})
      .setRuleLoaderOption(name, 'postcss-loader', 'plugins', [
        postcssPresetEnv()
      ])
  }

  /**
   * @todo env injection
   */
  function setupSass(builder: Builder, name: string): void {
    builder
      .setRuleLoaderOption(name, 'sass-loader', 'data', `$env: ${process.env.NODE_ENV};`)
  }

  return builder
}

function guessGCSSEntry(context: string): ?string {
  const gcssFilePath = path.resolve(context, 'src/style.css')
  return fs.existsSync(gcssFilePath) ? gcssFilePath : null
}


/// export

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
export default preset

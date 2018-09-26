/**
 * spa-preset
 *
 * configure spa project
 *
 * @flow
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Builder from './builder'


/// code

const preset = Builder()
      // .setRuleLoader('js', 'babel-loader')
      // .setRuleLoaderOption('js', 'babel-loader', 'cacheDirectory', true)
      // .setRuleLoader('css', 'postcss-loader')
      // .setRuleLoaderOption('css', 'postcss-loader', 'sourceMap', true)
      // .setRuleLoaderDev('css', 'css-loader', {
      //   options: {
      //     sourceMap: true
      //   }
      // })
      // .setRuleLoaderDev('css', 'style-loader', {
      //   options: {
      //     sourceMap: true
      //   }
      // })
      // .setRuleLoaderProd('css', 'postcss-loader')
      // .setRuleLoaderProd('css', 'css-loader')
      // .setRuleLoaderProd('css', 'style-loader')



/// export

export default preset


/// test

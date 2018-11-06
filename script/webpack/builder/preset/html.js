/**
 * html preset
 *
 * @link [FrontEndChecklist](https://github.com/thedaviddias/Front-End-Checklist)
 * @flow
 */

import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'


/// code

export default function preset(builder: *): * {
  builder
    .setPlugin('html', HtmlWebpackPlugin, {
      mobile: true,
      title: 'WebpackApp',
      meta: [
        // { name: '', content: '' }
      ],
      template: HtmlWebpackTemplate,
      inject: false,
      mobile: true
    })
  return builder
}

export const dependencies = [
  'html-webpack-plugin',
  'html-webpack-template'
]

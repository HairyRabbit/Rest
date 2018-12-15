/**
 * icon
 *
 * icon preset
 *
 * @flow
 */

import { DefinePlugin } from 'webpack'


/// code

export type Options = {
  context?: string,
  store?: string
}

export default function preset(builder: *, options?: Options = {}): * {
  const {
    context = builder.context,
    store = '/icons.svg',
    inline = false
  } = builder.options.icon || {}

  builder
    .setRuleLoader('icon', 'babel-loader')
    .setRuleLoaderOption('icon', 'babel-loader', 'cacheDirectory', true)
    .setRuleLoader('icon', 'react-svg-loader')
    .setRuleLoaderOption('icon', 'react-svg-loader', 'jsx', false)
    .setRuleTypes('icon', ['svg'])
    .setPlugin('icon-context', DefinePlugin, {
      'process.env.ICON_CONTEXT': JSON.stringify(context)
    })
    .setPlugin('icon-store', DefinePlugin, {
      'process.env.ICON_STORE': JSON.stringify(store)
    })
    .setPlugin('icon-store-inline', DefinePlugin, {
      'process.env.ICON_STORE_INLINE': JSON.stringify(inline)
    })

  return builder
}

export const dependencies = [
  'babel-loader',
  'react-svg-loader'
]

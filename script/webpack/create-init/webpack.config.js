module.exports = require('@rabbitcc/webpack-builder').default(
  [['nodelib', { script: { jsx: true } }]],
  { installOnCheckFail: true, nodelib: { script: { jsx: true }}, script: { jsx: true } }
)
  .setEntryName('main', require('./package.json').name)
  .setProd('output.path', 'bin')
  .set('output.filename', '[name]')
  .setPlugin('banner', require('webpack').BannerPlugin, {
    banner: '#!/usr/bin/env node\n',
    raw: true,
    entryOnly: true
  })
  .setRuleLoader('txt', 'raw-loader')
  .setRuleLoader('yaml', 'json-loader')
  .setRuleLoader('yaml', 'yaml-loader')
  .print()
  .transform()

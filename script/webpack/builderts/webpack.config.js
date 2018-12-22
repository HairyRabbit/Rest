/**
 * webpack.config.js
 */

var createBuilder = require('@rabbitcc/webpack-builder').default

/// code

module.exports = [
  createBuilder('nodelib', { mode: process.env.NODE_ENV }).print().transform(),

  createBuilder([[ 'nodelib', { name: 'nodelib-pitch-loader' } ]], { mode: process.env.NODE_ENV })
    .setEntryModule('main', './src/presets/nodelib/loader.ts')
    .transform()
]

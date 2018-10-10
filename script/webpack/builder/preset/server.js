/**
 * server
 *
 * server preset
 *
 * @env SERVER_HOST
 * @env SERVER_PORT
 * @flow
 */

import Builder from '../builder'


/// code

function server(builder: Builder): Builder {
  const { host, port } = builder.options
  const serverHost = host || process.env.SERVER_HOST || '0.0.0.0'
  const serverPort = port || process.env.SERVER_PORT || '23333'

  builder
    .setDev('devServer.host', serverHost)
    .setDev('devServer.port', serverPort)
    .setDev('devServer.publicPath', '/')
    .setDev('devServer.historyApiFallback', true)

  return builder
}


/// export

export const dependencies = ['webpack-dev-server']
export default server

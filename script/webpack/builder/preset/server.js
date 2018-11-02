/**
 * server
 *
 * server preset
 *
 * @env SERVER_HOST
 * @env SERVER_PORT
 * @flow
 */

/// code

export type Options = {
  host?: string,
  port?: number
}

function server(builder: *): * {
  const {
    host = process.env.SERVER_HOST || '0.0.0.0',
    port = process.env.SERVER_PORT || '23333'
  } = builder.options.server || {}

  builder
    .setDev('devServer.host', host)
    .setDev('devServer.port', port)
    .setDev('devServer.publicPath', '/')
    .setDev('devServer.historyApiFallback', true)
    .setDev('devServer.hot', true)

  return builder
}


/// export

export const dependencies = ['webpack-dev-server']
export default server

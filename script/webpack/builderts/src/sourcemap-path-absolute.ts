/**
 * override webpack sourcemap path to absolute, used for
 * debug in chrome devtools workspaces
 */

import * as path from 'path'
import { startsWith } from 'lodash'
import webpack from 'webpack'

export default function format(info: webpack.DevtoolModuleFilenameTemplateInfo): string {
  const protocol: string = 'file:///'
  const fmt: string = 'win32' === process.platform
    ? path.resolve(info.resourcePath)
        .replace(/\\/g, '\/')
        .replace(/(\w):/, (_, a) => a.toUpperCase() + ':')
    : path.resolve(info.resourcePath)

  return protocol + fmt
  // return info.allLoaders.length && !startsWith(info.allLoaders, 'css')
  //   ? prepend + fmt + `?${info.hash}`
  //   : prepend + fmt
}

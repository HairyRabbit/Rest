/**
 * rest
 *
 * rest app preset
 *
 * @flow
 */

import * as fs from 'fs'
import * as path from 'path'
import { DefinePlugin } from 'webpack'


/// code

export const use = "spa"

export default function preset(builder: *): * {
  const context = builder.context
  const initial = initialScriptPath(builder.context)

  builder.setPlugin('boot', DefinePlugin, {
    'global.__BOOT_NODE__': JSON.stringify('app'),
    'global.__BOOT_CONTEXT__': JSON.stringify('{}'),
    'global.__BOOT_INITIAL__': JSON.stringify(initial)
  })

  return builder
}

/**
 * find initial dir path
 *
 * 1. The "context/initial" dir must exists
 * 2. The "context/initial/index.js" file must exists
 */
function initialScriptPath(context: string): ?string {
  const initialPath = path.resolve(context, 'initial')
  const initialIndexPath = path.resolve(initialPath, 'index.js')

  if(!(fs.existsSync(initialPath) &&
       fs.statSync(initialPath).isDirectory() &&
       fs.existsSync(initialIndexPath) &&
       fs.statSync(initialIndexPath).isFile())) {
    return null
  }

  return initialPath
}

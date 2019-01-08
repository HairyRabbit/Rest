/**
 * create-init cli, util for quickly create green project 
 * by advance default configure
 */

import app from './components'
import path from 'path'
import TaskManager from './manager'
import group from './modules/group'
import gitignore from './modules/gitignore'
import editorconfig from './modules/editorconfig'


/// code

export default function main() {
  app(TaskManager([
    [group, { _: ['base'] }],
    [gitignore, {}, ['group(base)']],
    [editorconfig, {}, ['group(base)']]
  ], path.resolve('./foo/bar/baz')))
}

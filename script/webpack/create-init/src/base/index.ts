/**
 * the default task
 */

import { combineTasks } from '../task'
import gitignore, { Options as GitIgnoreOptions } from '../gitignore'
import editorconfig, { Options as EditorConfigOptions } from '../editorconfig'

export interface Options {}
export default combineTasks<[GitIgnoreOptions, EditorConfigOptions]>('base', gitignore, editorconfig)

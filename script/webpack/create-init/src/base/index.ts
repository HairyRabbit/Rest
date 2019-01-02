/**
 * the default task
 */

import createTask from '../task'
import gitignore from '../gitignore'
import editorconfig from '../editorconfig'

export default createTask('base', gitignore, editorconfig)

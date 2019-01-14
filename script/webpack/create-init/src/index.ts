/**
 * create-init cli, util for quickly create green project 
 * by advance default configure
 */

import app from './components'
import fs from 'fs'
import yargs from 'yargs-parser'
import path from 'path'
import chalk from 'chalk'
import createTaskManager from './manager'
import { parseFile } from './parser'


/// code

export default function main() {
  const argv = process.argv.slice(2)
  const { _: requires, $0, ...options } = yargs(argv)
  const cmd = requires.shift()
  const isShowHelp = options.help || options.h

  /**
   * no task provide
   */
  if(!cmd) {
    console.log('\n  🐰 any task ?\n')
    process.exit(0)
    return
  }

  const pkgcontext = path.resolve(__dirname, '../packages')
  const pkgs = fs.readdirSync(pkgcontext)

  /**
   * no task found
   */
  if(pkgs[cmd]) {
    console.log(`\n  🐰 not task found ${cmd} ?\n`)
    process.exit(0)
    return
  }

  /**
   * parse config
   */
  const cmdroot = path.resolve(__dirname, `../packages/${cmd}`)
  const configpath = path.resolve(cmdroot, 'tasks.yaml')

  const context = {
    root: process.cwd(),
    cmdroot
  }

  const { name, 
          description, 
          options: argvOptions,
          requires: argvRequires,
          tasks } = parseFile(configpath, { requires: requires, options, context })
  
  /**
   * render TUI
   */
  console.log('\n  📦 ' + name)
  console.log('\n     ' + description)
  console.log('\n  ' + '-'.repeat(80))

  if(isShowHelp) {
    const usage = [`\n     ${chalk.gray('$')} npm create my ${cmd}`]
    const options = []
    const requires = []
    
    if(argvRequires && argvRequires.length) {
      argvRequires.forEach(defs => { 
        const [ defaultName, defaultDescription ] = 'string' === typeof defs
          ? [ defs, undefined ]
          : Object.entries(defs)[0]
        
        usage.push(`<${defaultName}>`)
        requires.push(`\n     • <${defaultName}> - ${defaultDescription}`)
      })
    }

    if(argvOptions) {      
      for (const key in argvOptions) {
        if (argvOptions.hasOwnProperty(key)) {
          const { type, description, default: optionsDefaultValue } = argvOptions[key]
          options.push(`\n     • --${key}: ${chalk.cyanBright(type)} = ${chalk.yellow(JSON.stringify(optionsDefaultValue))} - ${description}`)
        }
      }

      if(options.length) usage.push(`[options]`)
    }

    console.log('\n  🍈 ' + 'Usage:')
    console.log(usage.join(' '))

    if(requires) {
      console.log('\n')
      console.log('\n  🍐 ' + 'Requires:')
      console.log(requires.join(' '))
    }

    if(options.length) {
      console.log('\n')
      console.log('\n  🥝 ' + 'Options:')
      console.log(options.join(' '))
    }

    process.exit(0)
    return
  }
  
  /**
   * run tasks
   */
  app(createTaskManager([...tasks], context))
}

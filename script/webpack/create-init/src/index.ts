/**
 * create-init cli, util for quickly create green project 
 * by advance default configure
 */

import app from './components'
import yargs from 'yargs'
import path from 'path'
import TaskManager from './manager'
import { parseFile } from './parser'


/// code

export default function main() {

  const { /** defaults */_: defaults, $0, ...options } = yargs.argv
  const cmd = defaults.shift()

  if(!cmd) throw 42 // @todo print helper
  switch(cmd) {
    case 'foy': break
    case 'girlfriend': console.log('\n  👩 that\'s not possible'); return
    default: throw new Error(`Unknown command ${cmd}`)
  } // @todo validate cmd and suggest 

  /**
   * commander context
   */
  const cmdroot = path.resolve(__dirname, `../packages/${cmd}`)
  
  // console.log(require('util').inspect(tasks, { depth: null}))
  const context = {
    root: process.cwd(),
    cmdroot
  }

  const { name, description, tasks } = parseFile(path.resolve(cmdroot, 'tasks.yaml'), { defaults, options, context })
  console.log('\n  📦 ' + name)
  console.log('\n  ' + description)
  

  // console.log(require('util').inspect(acc, { depth: null}))

  app(TaskManager([...tasks], {
    root: path.resolve(yargs.argv._[0]),
    cmdroot
  }))
  

  // process.exit()
  // mountCmds(yargs)
  //   .usage(`$0 <target> [options]`)
  //   .updateStrings({
  //     'Commands:': 'Targets:',
  //   })
  //   .demandCommand().recommendCommands().strict()
  //   .alias('v', 'version')
  //   .alias('h', 'help')
  //   .epilogue('copyright 2018')
  //   .argv
}

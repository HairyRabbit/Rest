import { Argv } from 'yargs'
import lib from './lib'

export default function mountCmds(yargs: Argv): Argv {
  return yargs
    .command(lib)
}

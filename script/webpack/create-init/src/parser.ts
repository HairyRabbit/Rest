import * as mods from './modules'
import { isUndefined, isEmpty, isArray, isString } from 'lodash'
import Task, { TaskContext, TaskConstructor } from './tasker'
import { safeLoad as yaml } from 'js-yaml'
import { readFileSync as readFile } from 'fs'

/// code

interface ParserResult {
  task: Task<any>,
  alias?: string
}

interface ParseResult {

}

interface ConfigBase {
  name: string
  description?: string
  usage: string
  defaults: Array<{ [k: string]: string }>
  options: {
    [k:string]: {
      type?: string,
      description: string,
      default?: string
    }
  }
  var: {
    [key: string]: string
  }
}

type ConfigTaskObject = {
  options?: { [k: string]: any }
  tasks: ConfigTasks
}
type ConfigTask = string | { [k:string]: ConfigTaskObject }
type ConfigTaskArray = Array<ConfigTask>
type ConfigTasks = ConfigTask | ConfigTaskArray

interface Config extends ConfigBase {
  match: {
    [key: string]: ConfigTasks
  },
  tasks: ConfigTasks
}

interface ConfigTaskCondition {
  [k:string]: ConfigTasks
}

interface Options {
  context: TaskContext
  options: { [k:string]: unknown }
  defaults: Array<string>
}

/**
 * 
 * @param config config file content
 * @param options 
 */
export default function parse(config: Config, options: Options): ParseResult {
  const { name, 
          description, 
          defaults: definedDefaults,
          options: definedOptions,
          var: definedVars, 
          match, tasks: defaultTasks } = config
  const { options: argsOptions, defaults: argsDefaults } = options

  /**
   * should parsed tasks, ensure the tasks exists
   */
  const tasks: undefined | ConfigTasks = match 
    ? matchTask(match, defaultTasks, argsDefaults)
    : defaultTasks
  
  if(!tasks) throw new Error(
    `can't fount tasks`
  )

  const vars: Map<string, string> = new Map()
  for (const key in definedVars) {
    if (definedVars.hasOwnProperty(key)) {
      const element = definedVars[key]
      vars.set(key, element)
    }
  }
  for (let index = 0; index < argsDefaults.length; index++) {
    const element = argsDefaults[index]
    vars.set(index.toString(), element)
  }

  for (const key in definedOptions) {
    if (definedOptions.hasOwnProperty(key)) {
      vars.set(key, argsOptions[key])
    }
  }

  return {
    name,
    description,
    tasks: parseTasks(tasks, options, vars)
  }
}

function parseTasks(tasks: ConfigTasks, options: Options, vars: Map<string, string>): Set<ParserResult> {
  const { context } = options
  const acc: Set<ParserResult> = new Set()

  function recur(task: ConfigTask): void {
    if(isString(task)) {
      acc.add(parseTask(task, {}, context, vars))
      return
    }

    const name = Object.keys(task)[0]
    const { tasks = undefined, options: taskOpts = {} } = task[name] || {}
    acc.add(parseTask(name, taskOpts, context, vars))
    
    if(!tasks) return
    mapTasks(tasks)
  }

  function mapTasks(tasks: ConfigTasks) {
    const ensureTasks = isArray(tasks) ? tasks : [tasks]
    ensureTasks.forEach(recur)
  }

  mapTasks(tasks)
  return acc
}

function matchTask(conditions: ConfigTaskCondition, defaults: ConfigTasks, cmds: Array<string>): ConfigTasks {
  const fst: undefined | string = cmds.shift()
  const defaultTask: undefined | ConfigTasks = conditions._ || defaults

  /**
   * cmds was empty
   */
  if(!fst) {
    if(!defaultTask) throw new Error(
      `can't fount default task`
    )

    return defaultTask
  }

  let matched; if((matched = conditions[fst])) return matched

  if(!defaultTask) throw new Error(
    `can't fount default task`
  )

  cmds.unshift(fst)
  return defaultTask
}

export function parseFile(filepath: string, options: Options): ReturnType<typeof parse> {
  return parse(yaml(readFile(filepath, 'utf8')), options)
}

/**
 * parse config task
 * 
 * @param str 
 * @param opts 
 * @param context 
 * @param defaults 
 */
function parseTask(str: string, opts: { [k: string]: string }, context: TaskContext, vars: Map<string, string>): ParserResult {
  const words: Array<string> = applyVar(str, vars).split(' ')

  const task: undefined | string = words.shift()
  if(isUndefined(task)) throw new Error(`mod was required`)

  const defs: Array<string> = []
  let alias: undefined | string

  let c: undefined | string;while((c = words.shift())) {
    if(!c) break
    switch(c) {
      case 'as': {
        const _alias = words.shift()
        if(isUndefined(_alias)) throw new Error(`require a alias name "${task}"`)
        alias = _alias
        break
      }

      default: {
        defs.push(c)
        break
      }
    }
  }

  const modules: { [k: string]: typeof mods[keyof typeof mods] } = mods
  const Task: { [K in keyof typeof mods]: typeof mods[K] extends TaskConstructor<infer R> ? TaskConstructor<R> : TaskConstructor<any> }[keyof typeof mods] = modules[task]
  
  /**
   * replace placeholder for options values
   */
  for (const key in opts) {
    if (opts.hasOwnProperty(key)) {
      opts[key] = applyVar(opts[key], vars)
    }
  }
  
  const options = { _: defs, ...opts }
  return {
    task: new Task(context, options),
    alias
  }
}


function applyVar(target: string, vars: Map<string, string>): string {
  const regexp = /\$(\w+)/
  const matched = target.match(regexp)
  if(!matched) return target
  const key = matched[1]
  const variable = vars.get(key)
  if(!variable) throw new Error(
    `var "${key}" not found`
  )
  return target.replace(regexp, variable)
}

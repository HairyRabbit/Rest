/**
 * task config file parser
 */

import * as mods from './modules'
import { isUndefined, isEmpty, isArray, isString, trim } from 'lodash'
import Task, { TaskContext, TaskConstructor, TaskOptions } from './tasker'
import { safeLoad as yaml } from 'js-yaml'
import { readFileSync as readFile } from 'fs'

/// code

type TaskObject = {
  options?: { [k: string]: any }
  tasks: TaskSet
}
type TaskCompose = string | { [k: string]: TaskObject }
type TaskArray = Array<TaskCompose>
type TaskSet = TaskCompose | TaskArray
type TaskCondition = {
  [k: string]: TaskSet
}

interface ParseResult extends ConfigBase {
  tasks: Set<TaskSet>,
  alias?: string
}

interface ConfigBase {
  name: string
  description?: string
  usage: string
  requires: Array<string | { [k: string]: string }>
  options: {
    [k:string]: {
      type?: string,
      description: string,
      default?: string
    }
  }
}

type ConfigVarTable = {
  var: {
    [key: string]: string
  }
}

interface ConfigTasks {
  match: {
    [key: string]: TaskSet
  },
  tasks: TaskSet
}

type Config = ConfigBase & ConfigVarTable & ConfigTasks

/**
 * task parser options
 */
interface Options {
  /**
   * context options, used for instantiate a task
   */
  context: TaskContext
  /**
   * parsed argv options
   */
  options: { [k:string]: unknown }
  /**
   * parsed argv defaults
   */
  requires: Array<string>
}

/**
 * parse task configs
 * 
 * @param config config file content, should already transform to json
 * @param options parsed args options
 */
export default function parse(config: Config, options: Options): ParseResult {
  const { requires: definedRequires = [],
          options: definedOptions = {},
          var: definedVars = {}, 
          match, tasks: defaultTasks,
          ...rest } = config

  const { options: argsOptions, 
          requires: argsRequires } = options

  /**
   * should parsed tasks, ensure the tasks exists
   */
  const tasks: undefined | TaskSet = match 
    ? matchTask(match, defaultTasks, argsRequires)
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
  for (let index = 0; index < definedRequires.length; index++) {
    const element = argsRequires[index]
    vars.set(index.toString(), element)
  }

  for (const key in definedOptions) {
    if (definedOptions.hasOwnProperty(key)) {
      vars.set(key, argsOptions[key])
    }
  }

  console.log(vars)

  return {
    tasks: parseTasks(tasks, options, vars),
    requires: definedRequires,
    options: definedOptions,
    ...rest
  }
}

/**
 * parse tasks with argv options and variables
 * 
 * @param tasks ready to exec tasks 
 * @param options parsed args options
 * @param vars variable table
 */
function parseTasks(tasks: TaskSet, options: Options, vars: Map<string, string>): Set<ParseResult> {
  const { context } = options
  const acc: Set<ParseResult> = new Set()

  function recur(task: TaskCompose): void {
    if(isString(task)) {
      acc.add(parseTask(task, {}, context, vars))
      return
    }

    const name = Object.keys(task)[0]
    /**
     * @todo parse taskOpts
     */
    const { tasks = undefined, options: taskOpts = {} } = task[name] || {}
    acc.add(parseTask(name, taskOpts, context, vars))
    
    if(!tasks) return
    mapTasks(tasks)
  }

  function mapTasks(tasks: TaskSet): void {
    const ensureTasks = isArray(tasks) ? tasks : [tasks]
    ensureTasks.forEach(recur)
  }

  mapTasks(tasks)
  return acc
}

/**
 * match tasks by name, be careful, the cmds stack was modified 
 * when match successful
 * 
 * @param conditions will match tasks
 * @param defaults default tasks, if not matched any task, use 
 * the default task
 * @param cmds command stack, pop the stack to match task name
 */
function matchTask(conditions: TaskCondition, 
                   defaults: TaskSet, 
                   cmds: Array<string>): TaskSet {
  const fst: undefined | string = cmds.shift()
  const defaultTask: undefined | TaskSet = conditions._ || defaults
  const err: Error = new Error(`can't fount default task`)
  
  /**
   * cmds was empty
   */
  if(!fst) {
    if(!defaultTask) throw err
    return defaultTask
  }

  let matched: TaskSet; if((matched = conditions[fst])) return matched  

  /**
   * match fail, back matcher to cmd stack, and return default task
   */
  if(!defaultTask) throw err
  cmds.unshift(fst)
  return defaultTask
}

/**
 * parse task config from yaml file
 * 
 * @param filepath task config file path, should be absolute path
 * @param options args options, pass to parser
 */
function parseFile(filepath: string, options: Options): ReturnType<typeof parse> {
  return parse(yaml(readFile(filepath, 'utf8')), options)
}


interface ParseTaskResult<O> {
  task: Task<O>,
  readonly alias?: string
}

/**
 * parse task key, split task name and requires
 * 
 * @param str stringify key
 * @param opts user defined task options from config 
 * @param context task context, pass to task constructor
 * @param vars variable table
 */
function parseTask<T extends TaskOptions<any>>(str: string, opts: { [k: string]: string | undefined }, context: TaskContext, vars: Map<string, string>): ParseTaskResult<T> {
  const words: Array<string> = str.split(' ').map(trim)
  const task: undefined | string = words.shift()
  if(isUndefined(task)) throw new Error(`task was required`)

  const requires: Array<undefined | string> = []
  const options: { [k: string]: string | undefined } = {}
  
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
        requires.push(applyVar(c, vars))
        break
      }
    }
  }

  const modules: { [k: string]: typeof mods[keyof typeof mods] } = mods
  const Task: TaskConstructor<any> = modules[task]
  
  /**
   * replace placeholder for defined options keys and values
   */
  for (const key in opts) {
    if (opts.hasOwnProperty(key)) {
      const _key = applyVar(key, vars)      
      const _val = applyVar(opts[key], vars)
      if(_key) options[_key] = _val
    }
  }
  
  /**
   * combined task options with requires and options
   */
  const taskOptions = { _: requires as T['_'], ...options }

  return {
    task: new Task(context, taskOptions as T),
    alias
  }
}

/**
 * replace variabel by `$var`, set by variable table
 * 
 * @param target will replace target
 * @param vars variable table
 */
function applyVar(target: string | undefined, vars: Map<string, string | undefined>): string | undefined {
  if(isUndefined(target)) return target

  const regexp: RegExp = /\$(\w+)/
  
  let matched: null | RegExpMatchArray 
  if(!(matched = target.match(regexp))) return target

  return vars.get(matched[1])
}


export { parseFile }

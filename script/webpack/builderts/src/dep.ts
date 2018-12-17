/**
 * dependency
 */

import { isString, isFunction, isEmpty, isUndefined, groupBy } from "lodash"
import { execSync } from 'child_process'
import { Logger } from "./builder"


/// code

export enum DependencyFlag { Dev = 'D', Prod = 'P' }

export interface DependencyOptions<O> {
  readonly flag?: DependencyFlag
  assert?(options?: O): boolean
}

export const DEFAULT_DEPENDENCYOPTIONS: DependencyOptions<never> = {
  flag: DependencyFlag.Dev
}

export type Dependency<O> = [ string, DependencyOptions<O> ]
export type DependencyCompose<O> =
  | string
  | Dependency<O>

export type DependencyValidateOptions = {
  readonly report?: boolean,
  readonly mountOnFailed?: boolean
}

export const DEFAULT_DEPENDENCYVALIDATEOPTIONS: DependencyValidateOptions = {
  report: true,
  mountOnFailed: false
}

type ValidateFailed = {
  dependendy: string,
  issues: Array<string>,
  flag: DependencyFlag
}

export interface IDependencyManage<O> {
  deps: Map<string, {
    issues: Set<string>,
    options: DependencyOptions<O>
  }>
  create(dep: DependencyCompose<O>, issue: string): void
  validate(options: { report: boolean, mountOnFailed: boolean }): [ true, null ] | [ false, Array<ValidateFailed> ]
}

export class Dependencies<O> implements IDependencyManage<O> {
  deps: IDependencyManage<O>['deps']
  options: O
  constructor(options) {
    this.options = options || {}
    this.deps = new Map()
  }
  create(dep: DependencyCompose<O>, issue: string): void {
    const [ dependency, options ] = normalize(dep)
    const _dep = this.deps.get(dependency)
    if(isUndefined(_dep)) {
      this.deps.set(dependency, { issues: new Set([ issue ]), options })
    } else {
      _dep.issues.add(issue)
    }
  }

  validate(): [ true, null ] | [ false, Array<ValidateFailed> ] {
    const failed: Set<ValidateFailed> = new Set()
    this.deps.forEach(({ issues, options }, dep) => {
      const { flag, assert } = options
      if(isFunction(assert) && !assert(this.options)) return
      if(isExists(dep)) return

      failed.add({
        dependendy: dep,
        issues: Array.from(issues),
        flag: flag || DependencyFlag.Dev
      })
    })

    if(isEmpty(failed)) return [ true, null ]
    return [ false, Array.from(failed) ]
  }
}

/**
 * normalize dependency from string to Dependency
 *
 * @param dep
 */
export function normalize<O>(dep: DependencyCompose<O>): Dependency<O> {
  if(isString(dep)) return [ dep, DEFAULT_DEPENDENCYOPTIONS ]
  return [ dep[0], { ...DEFAULT_DEPENDENCYOPTIONS, ...(dep[1] || []) } ]
}

export function isExists(dep: string): boolean {
  try {
    __non_webpack_require__.resolve(dep)
  } catch(e) {
    return false
  }
  return true
}

export interface ReportOption {
  readonly logger?: Logger
}

export function report(failed: Array<ValidateFailed>,
                       { logger = console }: ReportOption): Array<string> {
  const message: Array<string> = []
  const groupByFlag = groupBy(failed, 'flag')
  const accByFlag: { [ K in DependencyFlag ]: Array<string> } = {
    [DependencyFlag.Dev]: [],
    [DependencyFlag.Prod]: []
  }

  failed.forEach(({ dependendy, issues, flag }) => {
    message.push(`  - "${dependendy}" was not found, requied by { ${issues.join(', ')} }`)
    accByFlag[flag].push(dependendy)
  })

  const printInstalls: Array<string> = []

  Object.keys(accByFlag).forEach(flag => {
    printInstalls.push(`-${flag} ${accByFlag[flag].join(' ')}`)
  })

  logger.warn(`dependencies checked result: \n\n ${message.join('\n')}`)
  logger.warn(printInstalls.map(s => `  npm(or yarn) add ${s}`).join('\n'))

  return printInstalls
}

export enum Cmder { Npm = 'npm', Yarn = 'yarn' }
export interface InstallOptions {
  readonly logger?: Logger
  readonly cmder?: Cmder
  readonly silent?: boolean
}
export function install(cmds: Array<string>, { cmder = Cmder.Npm,
                                               logger = console,
                                               silent = false }: InstallOptions = {}): boolean {
  let output: string | Buffer

  try {
    output = execSync(
      cmds.map(s => `${cmder} add ${s}`
    ).join('&'))
  } catch(e) {
    if(!silent) logger.error(e)
    return false
  }

  if(!silent) logger.info(output.toString())
  return true
}

/**
 * fs and path utils
 */

import * as fs from 'fs'
import * as path from 'path'

export function isTargetExists(f: ((stats: fs.Stats) => boolean)) {
  return (target: string): boolean => {
    if(!fs.existsSync(target)) return false
    try {
      const stats: fs.Stats = fs.statSync(target)
      if(f(stats)) return true
      return false
    } catch(e) {
      return false
    }
  }
}

export const isDirExists = isTargetExists((stats: fs.Stats) => stats.isDirectory())
export const isFileExists = isTargetExists((stats: fs.Stats) => stats.isFile())

export function getParentPath(target: string): string {
  const p: Array<string> = path.resolve(target).split(path.sep)
  p.pop()
  return p.join(path.sep)
}

export function formatToPosixPath(target: string): string {
  return target.split(path.sep).join(path.posix.sep)
}

export function isPathRelativeContext(filepath: string, context: string): boolean {
  const relative: string = path.relative(context, filepath)
  return !(relative.startsWith('..') || relative === filepath)
}

export function listDirs(dirpath: string, context: string): Array<string> {
  return path.relative(context, path.normalize(dirpath))
    .split(path.sep)
    .reduce<Array<string>>((acc, curr: string) => {
      acc.push(acc.length ? path.join(acc[acc.length - 1], curr) : curr)
      return acc
    }, [])
    .map(p => path.join(context, p))
}

export function rmdirRecur(dirpath: string, context: string): void {
  return rmdirs(listDirs(dirpath, context).reverse())
}

export function rmdirs(dirpaths: Array<string>): void {
  return dirpaths.forEach(fs.rmdirSync.bind(fs))
}

export function checkDirExists(dirpath: string, context: string): Array<string> {
  const dirs: Array<string> = listDirs(dirpath, context)
  let dir: undefined | string
  while((dir = dirs.shift())) {
    if(!fs.existsSync(dir)) {
      dirs.unshift(dir)
      break
    }
  }
  return dirs
}

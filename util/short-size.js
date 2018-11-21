/**
 * transform size integer to readable short size string
 *
 * @flow
 */

export type Options = {
  digits?: number,
  separator?: string,
  raw?: boolean
}

export default function transformSize(input: string, { digits = 2, separator = ' ', raw = false }: Options = {}): string {
  const byteStack = ['B', 'kB', 'MB', 'MB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let num = parseInt(input)
  let unit = byteStack.shift()
  let flag = 1000

  while(num >= flag) {
    num = num / flag
    unit = byteStack.shift()
    flag = 1024
  }

  if(raw) return { input, number: num, unit }
  if('B' === unit) return num.toString() + separator + unit
  return num.toFixed(digits) + separator + unit
}

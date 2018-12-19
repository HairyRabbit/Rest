/**
 * logger interface, same as `Console`
 */

export interface Logger {
  info(...optionalParams: Array<any>): void
  warn(...optionalParams: Array<any>): void
  error(...optionalParams: Array<any>): void
}

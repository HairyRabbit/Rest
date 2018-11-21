/**
 * generate random string
 *
 * @flow
 */

export default function randomString(length: number = 7): string {
  return Math.random().toString(16).substr(2, length)
}

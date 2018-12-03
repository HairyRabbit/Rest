/**
 * set css variable use js
 *
 * @flow
 */

export default function set(key: string, value: string): void {
  document.documentElement.style.setProperty(key, value)
}

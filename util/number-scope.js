/**
 * set number with min and max value
 *
 * @flow
 */

export type Scope = {
  min?: number,
  max?: number
}

export default function numberScope(num: number, { min = -Infinity, max = Infinity }: Scope = {}): number {
  return Math.max(min, Math.min(max, num))
}

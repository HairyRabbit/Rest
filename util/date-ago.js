/**
 * convert Date Object to short date ago format string
 *
 * @flow
 */

const comp = [
  [31536e6, 'year'],
  [2592e6, 'month'],
  [6048e5, 'week'],
  [864e5, 'day'],
  [36e5, 'hour'],
  [6e4, 'min'],
  [1e3, 'sec']
]

export default function transformDateAgo(input: Date | number): string {
  const _in = input instanceof Date ? input.getTime() : input
  const diff = Date.now() - _in

  for(let i = 0; i < comp.length; i++) {
    const item = comp[i]
    if(diff / item[0] > 1) {
      const num = parseInt(diff / item[0])
      return `${num > 1 ? num.toString() : 'a'} ${item[1]}${num > 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

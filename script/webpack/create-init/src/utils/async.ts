/**
 * async tools
 */

interface Mapper<T> {
  (a: T, i: number, l: Array<T>): void
}

export async function forEachParallel<A>(f: Mapper<A>, list: Array<A>): Promise<void> {
  await Promise.all(list.map(async (x, i, l) => await f(x, i, l)))
}

export function forEachMapParallel<A>(f: Mapper<A>, map: Map<string, A>): ReturnType<typeof forEachParallel> {
  return forEachParallel(f, Array.from(map.values()))
}

export async function forEachSeries<A>(f: Mapper<A>, list: Array<A>): Promise<void> {
  let i = 0;
  for await (const item of list) {
    f(item, i, list)
    i++
  }
}

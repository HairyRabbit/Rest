export default function applyMixins<C extends { new(...a: any[] ): any }>(derivedCtor: C, ...baseCtors: any[]): C {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
  return derivedCtor
}

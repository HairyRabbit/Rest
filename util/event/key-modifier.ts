/**
 * collect modifier key and compute factor
 */

export type Modifier = {
  ctrl: number,
  shift: number,
  alt: number,
  default: number
}

export const DEFAULT_MODIFIER_PERCENT: Modifier = {
  ctrl: 0.1,
  shift: 0.05,
  alt: 0.005,
  default: 0.01
}

export const DEFAULT_MODIFIER_VALUE: Modifier = {
  ctrl: 100,
  shift: 10,
  alt: 0.1,
  default: 1
}

export default function computeModifierFactor(evt: MouseEvent,
                                              modifier?: Modifier): number {
  return mapModifier(
    modifier || DEFAULT_MODIFIER_VALUE,
    evt.ctrlKey,
    evt.shiftKey,
    evt.altKey
  )
}

function mapModifier(modifier: Modifier,
                     ctrlKey: boolean,
                     shiftKey: boolean,
                     altKey: boolean): number {
  switch(true) {
    case ctrlKey: return modifier.ctrl
    case shiftKey: return modifier.shift
    case altKey: return modifier.alt
    default: return modifier.default
  }
}

/**
 * mouseWheelHandler, preprocess mouse wheel event
 */

/// code

export type Modifier = {
  ctrl: Number,
  shift: Number,
  alt: Number,
  default: Number
}

export const DEFAULT_MODIFIER: Modifier = {
  ctrl: 100,
  shift: 10,
  alt: 0.1,
  default: 1
}

type WheelEventHandler<R> = (
  evt: MouseWheelEvent,
  wheel: Number,
  base?: Number
) => R

export default function handleMouseWheel<R>(onWheel: WheelEventHandler<R>, mod?: Modifier) {
  return function handleMouseWheelHandler(evt: MouseWheelEvent): void {
    evt.preventDefault()
    const { deltaY } = evt
    const wheel = deltaY > 0 ? -1 : 1

    /**
     * if modifier is not set, no need to compute base, just
     * return wheel as well
     */
    if(!mod) {
      onWheel(evt, wheel, undefined)
      return
    }

    const { ctrlKey, shiftKey, altKey } = evt
    const base = mapModifier(mod || DEFAULT_MODIFIER, ctrlKey, shiftKey, altKey)
    onWheel(evt, wheel, base)
  }
}

function mapModifier(modifier: Modifier, ctrlKey: Boolean, shiftKey: Boolean, altKey: Boolean): Number {
  switch(true) {
    case ctrlKey: return modifier.ctrl
    case shiftKey: return modifier.shift
    case altKey: return modifier.alt
    default: return modifier.default
  }
}

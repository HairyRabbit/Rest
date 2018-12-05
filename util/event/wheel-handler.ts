/**
 * mouseWheelHandler, preprocess mouse wheel event
 */

import computeModifierFactor, { Modifier, DEFAULT_MODIFIER_VALUE } from './key-modifier'


/// code

type WheelEventHandler<R> = (
  evt: MouseWheelEvent,
  wheel: -1 | 1,
  factor?: number
) => R

export default function handleMouseWheel<R>(onWheel: WheelEventHandler<R>, mod?: boolean | Modifier) {
  return function handleMouseWheelHandler(evt: MouseWheelEvent): void {
    evt.preventDefault()
    const { deltaY } = evt
    const wheel = deltaY > 0 ? -1 : 1

    /**
     * if modifier is not set, no need to compute factor, just
     * return wheel as well
     */
    onWheel(evt, wheel, !mod ? undefined : computeModifierFactor(
      evt,
      typeof mod === 'boolean' ? DEFAULT_MODIFIER_VALUE : mod
    ))
  }
}

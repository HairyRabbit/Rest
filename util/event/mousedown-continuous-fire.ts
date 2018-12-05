/**
 * Use `raq` mock continuous fire for mouse down event.
 * Like keyDown event, trigger handle at mouse down,
 * and delay a timeout trigger again, and stop when
 * `unscription` called. Usually the unscription should
 * bind to mouse up event. If `unscription` not called
 * the handle trigger until more then `MAX_CALL` times.
 *
 *
 * @example
 *
 * ```js
 * import * as React from 'react'
 * import { handleMouseDownFire } from '@util/event'
 *
 * function Component() {
 *   const unscription = React.useRef(noop)
 *   return <div onMouseDown={handleMouseDown}
 *               onMouseUp={unscription.current} />
 *
 *   function handleMouseDown() {
 *     unscription.current = handleMouseDownFire(
 *       prevState => prevState + 1,
 *       42
 *     )
 *   }
 * }
 * ```
 */

import { isFunction, isUndefined, throttle as th } from 'lodash'


/// code

export interface Handler<S> {
  (state: S | undefined, frameId: number, delayId: number): S
}

export const DEFAULT_DELAY: number = 550
export const DEFAULT_MAX_CALL: number = 500

const INIT_TIMERID: number = -1

export default function handleMouseDownFire<S>(handler: Handler<S>,
                                               init?: S,
                                               throttle?: number,
                                               timeout: number = DEFAULT_DELAY,
                                               max: number = DEFAULT_MAX_CALL): () => void {
  if('production' !== process.env.NODE_ENV) {
    if(!isFunction(handler))
      throw new Error(`handler callback was required`)
  }

  let delayId = INIT_TIMERID,
      frameId = INIT_TIMERID,
      counter = 0

  /**
   * Throttleable, when throttle argument provided.
   */
  const func = isUndefined(throttle)
    ? handler
    : th(handler, throttle)

  /**
   * Trigger handler at first call, and delay the timeout to
   * call handler again. At this moment, call handler with
   * animation frame use `window.requestAnimationFrame` pre
   * frame.
   */
  delayId = window.setTimeout(frame(
    func(init, frameId, delayId)
  ), timeout)

  return unsubscription

  function unsubscription(): void {
    window.clearTimeout(delayId)
    window.cancelAnimationFrame(frameId)
    delayId = INIT_TIMERID
    frameId = INIT_TIMERID
  }

  function frame(prev: S) {
    return () => {
      /**
       * If counter greater then or equal to max, call `unsubscription`
       * and stop set new animation frame, otherwise inc the counter.
       */
      if(counter >= max) return unsubscription()

      const next: S = func(prev, frameId, delayId)
      counter += 1
      frameId = window.requestAnimationFrame(frame(next))
    }
  }
}

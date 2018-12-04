/**
 * <NumberInput /> used for number type data
 *
 * -?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?
 */

/// <reference types="../../typings" />

import * as React from 'react'
import { throttle } from 'lodash'
import { TextField, Button, Slider } from '../'
import { combineClassNames as cc, numberScope as ns } from '../../util'
import handleMouseWheel from '../../util/event/wheel-handler'
import computeModifierFactor from '../../util/event/key-modifier'
import { DEFAULT_MODIFIER_VALUE } from '../../util/event/key-modifier'
import * as style from './style.css'


/// code

export interface Props {
  readonly min?: number
  readonly max?: number
  readonly step?: number
  readonly value?: string
  readonly className?: string
  readonly delay?: number
  readonly percent?: boolean
  readonly inc?: React.Component
  readonly dec?: React.Component
  onChange(evt: MouseEvent, value?: string): void
}

export const TIMER_INIT: number = -1
export const DELAY_INIT: number = 550

function NumberInput({ min,
                       max,
                       step = 1,
                       percent = false,
                       value,
                       onChange,
                       delay = DELAY_INIT,
                       className,
                       ...props }: Props): React.ReactElement<Props> {

  if('production' !== process.env.NODE_ENV) {

  }

  const mi = undefined !== min ? min : percent ? 0 : -Infinity
  const ma = undefined !== max ? max : percent ? 1 : +Infinity
  const isSlidable = isFinite(mi) && isFinite(ma)

  const delayTimer = React.useRef(TIMER_INIT)
  const frameTimer = React.useRef(TIMER_INIT)
  const val = parseFloat(value || '0')
  const handleWheel = handleMouseWheel(subscriptionWheel, true)
  const isDelaying = React.useRef(false)
  const isAnimation = React.useRef(false)
  // console.log(isAnimation)

  return (
    <div className={style.main}>
      <div className={style.spins}>
      <Button theme="default" surface="text" className={cc(style.spin, style[`spin-${'top'}`])} onMouseDown={handleMouseDown(+1 * step)} onMouseUp={handleMouseUp}>
        <Down />
      </Button>
      <Button theme="default" surface="text" className={cc(style.spin, style[`spin-${'bottom'}`])} onMouseDown={handleMouseDown(-1 * step)} onMouseUp={handleMouseUp}>
        <Down />
      </Button>
      </div>
      {/*<Slider className={style.slider} />*/}
      <TextField type="number"
                 className={cc(style.field, className)}
                 value={value}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
                 onWheel={handleWheel}
                 {...props} />
    </div>
  )

  function handleMouseDown(delta: number) {
    return function handleMouseDown1(evt: MouseEvent): void {

      const factor = computeModifierFactor(evt)
      const next = ns(val + delta * factor, { min: mi, max: ma })
      onChange(evt, next.toString())

      delayTimer.current = window.setTimeout(() => {
        frameTimer.current = window.requestAnimationFrame(frame(val))
      }, delay)

      function frame(val) {
        return () => {
          const next = ns(val + delta * factor, { min: mi, max: ma })
          onChange(evt, next.toString())
          frameTimer.current = window.requestAnimationFrame(frame(next))
        }
      }
    }
  }

  function handleMouseUp(): void {
    window.clearTimeout(delayTimer.current)
    window.cancelAnimationFrame(frameTimer.current)
    delayTimer.current = TIMER_INIT
    frameTimer.current = TIMER_INIT
  }


  function handleKeyDown(evt) {
    // evt.persist()
    let dir
    switch(evt.which) {
      case 38: dir = 1; break
      case 40: dir = -1; break
      default: return
    }

    evt.preventDefault()

    const factor = computeModifierFactor(evt)
    const next = ns(val + dir * step * factor, { min: mi, max: ma })
    onChange(evt, next.toString())
  }

  function subscriptionWheel(evt, wheel, factor): void {
    const next = ns(val + wheel * step * factor, { min: mi, max: ma })
    onChange(evt, next.toString())
  }

  function handleChange(evt): void {
    onChange(evt, evt.target.value)
  }
}

function Down() {
  return (
    <svg viewBox="0 0 64 64">
      <path d="M62,22l-30,28l-30,-28" />
    </svg>
  )
}


export default React.memo(NumberInput)

/**
 * <NumberInput /> used for number type data
 *
 * -?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?
 */

import * as React from 'react'
import { isUndefined, noop } from 'lodash'
import { TextField,
         Button, ButtonTheme, ButtonSurface,
         Slider,
         DirectionIcon, Direction as IconDirection } from '../'
import { combineClassNames as cc, numberScope as ns } from '../../util'
import { handleMouseWheel,
         handleMouseDownFire,
         computeModifierFactor,
         DEFAULT_MODIFIER_VALUE,
         ModifierKey,
         ModifierResult } from '../../util/event'
import { useMouseDownFire } from '../../util/react'
import * as style from './style.css'


/// code

export interface Props<V = string> {
  readonly min?: number
  readonly max?: number
  readonly step?: number
  readonly value?: V
  readonly className?: string
  readonly delay?: number
  readonly percent?: boolean
  readonly format?: string | ((value: V) => string)
  readonly parser?: string | RegExp | ((str: string) => V)
  readonly inc?: React.Component
  readonly dec?: React.Component
  onChange<E>(evt: E, value?: string): void
}

export enum Direction { UP = 1, DOWN = -1 }

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

  const mi = !isUndefined(min) ? min : (percent ? 0 : -Infinity)
  const ma = !isUndefined(max) ? max : (percent ? 1 : +Infinity)
  const isSlidable = isFinite(mi) && isFinite(ma)
  const modifier = isUndefined(step)
    ? DEFAULT_MODIFIER_VALUE
    : { ...DEFAULT_MODIFIER_VALUE, default: step }

  const val = parseFloat(value || '0')
  const handleWheel = handleMouseWheel(subscriptionWheel, modifier)
  const unsubscription = React.useRef(noop)

  const controls = [Direction.UP, Direction.DOWN].map(dir => (
    <Button key={`NumberInputControl-${dir}`}
            theme={ButtonTheme.DEFAULT}
            surface={ButtonSurface.TEXT}
            block
            className={cc(style.spin, style[`spin-${Direction[dir]}`])}
            onMouseDown={handleMouseDown(dir)}
            onMouseUp={unsubscription.current}>
      <DirectionIcon value={mapDirectionToIconDirection(dir)} />
    </Button>
  ))

  return (
    <div className={style.main}>
      <div className={style.spins}>
        {controls}
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

  function handleMouseDown(dir: Direction) {
    return function handleMouseDown1(evt: MouseEvent): void {
      const [ factor ] = computeModifierFactor(evt, modifier)
      unsubscription.current = handleMouseDownFire(
        prev => handler(evt, prev, dir, factor),
        val
      )
    }
  }

  function handleKeyDown(evt: KeyboardEvent): void {
    let dir
    switch(evt.which) {
      case 38: dir = 1; break
      case 40: dir = -1; break
      default: return
    }

    evt.preventDefault()

    const [ factor ] = computeModifierFactor(evt, modifier)
    handler(evt, val, dir, factor)
  }

  function subscriptionWheel(evt: WheelEvent, dir: Direction, [ factor ]: ModifierResult): void {
    handler(evt, val, dir, factor)
  }

  function handleChange(evt): void {
    onChange(evt, evt.target.value)
  }

  function handler<E>(evt: E,
                      prev: number,
                      dir: Direction,
                      factor: number): number {
    const next = ns(prev + dir * factor, { min: mi, max: ma })
    onChange(evt, next.toString())
    return next
  }
}

function mapDirectionToIconDirection(direction: Direction): IconDirection  {
  switch(direction) {
    case Direction.UP: return IconDirection.UP
    case Direction.DOWN: return IconDirection.DOWN
    default: throw new Error(`Unknow direction "${direction}"`)
  }
}



export default React.memo(NumberInput)

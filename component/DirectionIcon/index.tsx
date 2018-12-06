/**
 * <DirectionIcon />, A svg icon to show and animation directions
 * include up, down, prev and next. can used for <NumberInput />
 * <Select />, <Dropdown /> or <Pagination /> etc..
 *
 * @example
 *
 * ```js
 * import { DirectionIcon, Direction } from '@component'
 *
 * <DirectionIcon value={Direction.UP} />
 *
 * // or more simple
 *
 * <DirectionIcon value="up" />
 * ```
 *
 * @prop {'up' | 'down' | 'prev' | 'next' | Direction} - value, directions
 */

import { isString } from 'lodash'
import * as React from 'react'
import { combineClassNames as cc } from '../../util'
import * as reset from '../../style/reset.scss'


/// code

export enum Direction { UP, DOWN, PREV, NEXT }

export const ICON_PATHS: { [D in Direction]: string } = {
  [Direction.UP]: "M31.624,22.473c0.214,-0.192 0.538,-0.192 0.752,0c3.263,2.936 26.653,23.981 26.653,23.981c0.949,0.853 2.447,0.809 3.345,-0.1c0.897,-0.908 0.856,-2.338 -0.092,-3.191l-28.471,-25.617c-0.506,-0.455 -1.167,-0.655 -1.811,-0.604c-0.644,-0.051 -1.305,0.149 -1.811,0.604l-28.471,25.617c-0.948,0.853 -0.989,2.283 -0.092,3.191c0.898,0.909 2.396,0.953 3.345,0.1c0,0 23.39,-21.045 26.653,-23.981Z" ,
  [Direction.DOWN]: "M31.624,41.527c0.214,0.192 0.538,0.192 0.752,0c3.263,-2.936 26.653,-23.981 26.653,-23.981c0.949,-0.853 2.447,-0.809 3.345,0.1c0.897,0.908 0.856,2.338 -0.092,3.191l-28.471,25.617c-0.506,0.455 -1.167,0.655 -1.811,0.604c-0.644,0.051 -1.305,-0.149 -1.811,-0.604l-28.471,-25.617c-0.948,-0.853 -0.989,-2.283 -0.092,-3.191c0.898,-0.909 2.396,-0.953 3.345,-0.1c0,0 23.39,21.045 26.653,23.981Z",
  [Direction.PREV]: "M22.473,32.376c-0.192,-0.214 -0.192,-0.538 0,-0.752c2.936,-3.263 23.981,-26.653 23.981,-26.653c0.853,-0.949 0.809,-2.447 -0.1,-3.345c-0.908,-0.897 -2.338,-0.856 -3.191,0.092l-25.617,28.471c-0.455,0.506 -0.655,1.167 -0.604,1.811c-0.051,0.644 0.149,1.305 0.604,1.811l25.617,28.471c0.853,0.948 2.283,0.989 3.191,0.092c0.909,-0.898 0.953,-2.397 0.1,-3.345c0,0 -21.045,-23.39 -23.981,-26.653Z",
  [Direction.NEXT]: "M41.527,32.376c0.192,-0.214 0.192,-0.538 0,-0.752c-2.936,-3.263 -23.981,-26.653 -23.981,-26.653c-0.853,-0.949 -0.809,-2.447 0.1,-3.345c0.908,-0.897 2.338,-0.856 3.191,0.092l25.617,28.471c0.455,0.506 0.655,1.167 0.604,1.811c0.051,0.644 -0.149,1.305 -0.604,1.811l-25.617,28.471c-0.853,0.948 -2.283,0.989 -3.191,0.092c-0.909,-0.898 -0.953,-2.397 -0.1,-3.345c0,0 21.045,-23.39 23.981,-26.653Z"
}

export interface Props {
  readonly value?: 'up' | 'down' | 'prev' | 'next' | Direction
  readonly className?: string
}

/**
 * @memo
 */
export default function DirectionIcon({ value = Direction.DOWN,
                                        className,
                                        ...props }: Props = {}) {
  const dir: Direction = isString(value)
    ? Direction[value.toUpperCase()]
    : value

  return (
    <svg viewBox="0 0 64 64"
         className={cc(reset.icon, className)}
         {...props}>
      <path d={ICON_PATHS[dir]} />
    </svg>
  )
}

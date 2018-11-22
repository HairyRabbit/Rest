/**
 * <Pie /> chart view
 *
 * @flow
 */

import * as React from 'react'
import { sumBy } from 'lodash'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Point = [number, number]

export type Value = {
  value: number,
  color?: string
}

export type Props = {
  value?: Array<Value>,
  close?: Object,
  className?: string
}

export default function Pie({ value = [], close, className, ...props }: Props = {}) {
  if(close) {
    const sum = sumBy(value, 'value')
    const rest = 1 - sum
    value.push({ value: rest, className: style.other, ...close })
  }

  return (
    <svg viewBox="-1 -1 2 2" className={cs(style.main, className)} {...props}>
      {mapDataToPath(value).paths}
    </svg>
  )
}

function makePoint(percent: number): Point {
  const x = Math.cos(2 * Math.PI * percent)
  const y = Math.sin(2 * Math.PI * percent)
  return [ x, y ]
}

function mapDataToPath(value: Value): Array<React.Node> {
  return value.reduce(({ paths, last }, { value, ...props }, idx) => {
    const start = makePoint(last)
    last = last + value
    const end = makePoint(last)
    const path = makePath(start, end, value > 0.5 ? 1 : 0)

    paths.push((
      <path key={idx} d={path} {...props} />
    ))

    return { paths, last }
  }, { paths: [], last: 0 })
}

function makePath([ startX, startY ]: Point, [ endX, endY ]: Point, largeArcFlag: number): string {
  return [
    `M ${startX} ${startY}`,
    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    `L 0 0`
  ].join(' ')
}

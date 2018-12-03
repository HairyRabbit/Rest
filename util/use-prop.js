/**
 * react custom hook for build controlled and uncontrolled component
 *
 * @flow
 */

import { isFunction } from 'lodash'
import { useState, useRef } from 'react'

export default function useProp(prop, handle?, init?, pre?) {
  const val = prop || init
  const [ state, setState ] = useState(val)
  const initState = useRef(val)
  if(undefined !== prop && state !== prop) setState(prop)
  return [
    state,
    isFunction(handle)
      ? handle
      : pre
      ? ((...args) => setState(pre(...args)))
      : setState,
    initState
  ]
}

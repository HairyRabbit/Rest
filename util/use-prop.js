/**
 * react custom hook for build controlled and uncontrolled component
 *
 * @flow
 */

import { isFunction } from 'lodash'
import { useState, useRef } from 'react'

export default function useProp(init, handle?, value?, pre?) {
  const val = init || value
  const [ state, setState ] = useState(val)
  const initState = useRef(val)
  if(undefined !== init && state !== init) setState(init)
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

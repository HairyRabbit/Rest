/**
 * fetch DOMRect from dom node and refetch on window resize
 *
 * @flow
 */

import { isFunction } from 'lodash'
import { useState, useEffect } from 'react'


/// code

export default function useRect(ref, onInit, onCleanup): DOMRect {
  const [ rect, setRect ] = useState(null)

  useEffect(() => {
    const DOMRect = fetchDOMRect()
    if(isFunction(onInit)) onInit(DOMRect)
    /**
     * bind event on window resize
     */
    window.addEventListener('resize', fetchDOMRect)
    return function useRectCleanup() {
      window.removeEventListener('resize', fetchDOMRect)
      if(isFunction(onCleanup)) onCleanup(rect)
    }
  }, [])

  function fetchDOMRect() {
    const refDOMRect = ref.current.getBoundingClientRect()
    setRect(refDOMRect)
    return refDOMRect
  }

  return rect
}

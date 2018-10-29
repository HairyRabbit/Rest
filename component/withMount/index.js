/**
 * withMount HOC component
 *
 * run script didMount/willUnMount lifecycle
 *
 * @flow
 */

import * as React from 'react'
import { isFunction } from 'lodash'


/// code

function withMount(handle: Function): * {
  return function withMount1(Component: React.ComponentType<*>): * {
    /**
     * ensure handle was a function, at development mode
     */
    if('production' !== process.env.NODE_ENV) {
      if(!isFunction(handle)) {
        throw new Error(
          `[withMount] require handle function, but got "${typeof handle}"`
        )
      }
    }

    class WithMountWrappedComponent extends React.PureComponent<Props> {
      container: React.ElementRef<*>
      ret: any

      constructor(props: *) {
        super(props)

        this.containerRef = React.createRef()
      }

      componentDidMount() {
        const { containerRef, props } = this
        this.ret = handle({ containerRef, ...props })
      }

      /**
       * if this.ref provided and type was "function", call on this hook
       */
      componentWillUnmount() {
        const { containerRef, ret, props } = this

        if(!isFunction(ret)) return
        ret({ containerRef, ...props })
      }

      render() {
        return (
          <Component {...this.props} containerRef={this.containerRef} />
        )
      }
    }

    const name = Component.displayName || Component.name
    WithMountWrappedComponent.displayName = `WithMount(${name})`
    return WithMountWrappedComponent
  }
}


/// export

export default withMount


/// test

/**
 * withMount
 *
 * run script didMount/willUnMount lifecycle
 *
 * @flow
 */


import * as React from 'react'


/// code

type Props = Object

function withMount(mount: Function, unmount?: Function): * {
  return function withMount1(Component: React.Component): * {
    if('production' !== process.env.NODE_ENV) {
      if(!mount || 'function' !== typeof mount) {
        throw new Error(
          'mount was required or not Function'
        )
      }
    }

    return class withMountWrappedComponent extends React.PureComponent<Props> {
      container: React.ElementRef<HTMLElement>
      ret: any

      constructor(props: Props) {
        super(props)

        this.container = React.createRef()
      }

      componentDidMount() {
        const { container, props } = this

        this.ret = mount && mount({ container, ...props })
      }

      componentWillUnmount() {
        const { container, ret, props } = this

        unmount && unmount({ container, ...props }, ret)
      }

      render() {
        return (
          <Component {...this.props} container={this.container} />
        )
      }
    }
  }
}


/// export

export default withMount

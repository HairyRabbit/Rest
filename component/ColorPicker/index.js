/**
 * <ColorPicker /> used for select color
 *
 * @flow
 */

import * as React from 'react'
import { isFunction, isEqual, memoize } from 'lodash'
import { classnames as cs, numberScope, useRect } from '../../util'
import { Slider, PointMonitor, Card, Layout, Center, Typo, NumberInput } from '../'
import style from './style.css'


/// code

const HUE_MAX = 360
const HUE_MIN = 0
const ALPHA_MAX = 1
const ALPHA_MIN = 0
const CURSOR_SIZE: number = parseFloat(style.cursorSize)

export type Props = {

}

export default function ColorPicker({ value }: Props = {}): React.Node {
  /**
   * precheck
   */
  if('production' !== process.env.NODE_ENV) {

  }

  const [ hue, setHue ] = React.useState(HUE_MIN)
  const [ alpha, setAlpha ] = React.useState(ALPHA_MAX)
  const [ point, setPoint ] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef()
  const rect = useRect(containerRef)

  /**
   * sync point with rect
   */
  // React.useEffect(syncPoint, [rect])


  /**
   * @compute [point]
   */
  const cursorStyle = ({
    transform: `translate(${point.x - CURSOR_SIZE / 2}px, ${point.y - CURSOR_SIZE / 2}px)`
  })

  /**
   * @compute [point,hue,alpha]
   */
  const previewStyle = ({
    backgroundColor: `hsla(${computeHue()}, ${computeSaturation()}%, ${computeLightness()}%, ${alpha})`
  })

  /**
   * @compute [hue]
   */
  const hueStyle = ({
    backgroundColor: `hsl(${computeHue()}, 100%, 50%)`
  })

  /**
   * @!compute [hue]
   */
  const alphaBarStyle = {
    backgroundImage: `linear-gradient(to right, hsla(${computeHue()}, ${computeSaturation()}%, ${computeLightness()}%, 0), hsla(${computeHue()}, ${computeSaturation()}%, ${computeLightness()}%, 1))`
  }

  return (
    <Card className={style.main}>
      <PointMonitor value={point} onChange={handlePointChange}>
        {({ ...injects }) => (
          <div className={style.box} ref={containerRef} {...injects}>
            <div className={style.hsl} />
            <div className={style.hue}
                 style={hueStyle} />
            <div className={cs(style.cursor, style[`cursor-${'box'}`])}
                 style={cursorStyle} />
          </div>
        )}
      </PointMonitor>
      <Layout size="0:1" gutter="xs">
        <Center fill>
          <div className={style.preview} style={previewStyle} />
        </Center>
        <Layout vertical nogutter>
          <Layout vertical nogutter>
            <Typo size="xs">Hue {computeHue()}</Typo>
            <Slider value={hue}
                    onChange={setHue}
                    barProps={{ className: style[`bar-${'hue'}`] }}
                    cursorProps={{ className: cs(style.cursor, style[`cursor-${'slider'}`]) }} />
          </Layout>
          <Layout vertical nogutter>
            <Typo size="xs">Opacity {transformOpacity(alpha)}</Typo>
            <Slider value={alpha}
                    onChange={setAlpha}
                    barProps={{ className: style[`bar-${'alpha'}`], style: alphaBarStyle }}
                    cursorProps={{ className: cs(style.cursor, style[`cursor-${'slider'}`]) }}>
              <div className={style.alpha} />
            </Slider>
          </Layout>
        </Layout>
      </Layout>
      <Layout gutter="xs">
        <Layout vertical nogutter align=",center">
          <NumberInput name="hue"
                       size="xs"
                       className={style.field}
                       value={computeHue()} />
          <Typo size="xs" value="H" />
        </Layout>
        <Layout vertical nogutter align=",center">
          <NumberInput name="saturation"
                       size="xs"
                       className={style.field}
                       value={computeSaturation()} />
          <Typo size="xs" value="S%" />
        </Layout>
        <Layout vertical nogutter align=",center">
          <NumberInput name="lightness"
                       size="xs"
                       className={style.field}
                       value={computeLightness()} />
          <Typo size="xs" value="L%" />
        </Layout>
        <Layout vertical nogutter align=",center">
          <NumberInput name="alpha"
                       size="xs"
                       className={style.field}
                       value={transformOpacity(alpha)} />
          <Typo size="xs" value="A" />
        </Layout>
      </Layout>
    </Card>
  )

  function handlePointChange(evt) {
    if(!rect) return
    const { pageX: x, pageY: y } = evt
    const { left, top, right, bottom } = rect

    setPoint({
      x: numberScope(x, { min: left, max: right }) - left,
      y: numberScope(y, { min: top, max: bottom }) - top
    })
  }

  function computeHue() {
    return Math.round(HUE_MAX * hue).toString()
  }

  function computeSaturation(): string {
    if(!rect) return 0
    return Math.round(point.x / rect.width * 100)
  }

  function computeLightness(): string {
    if(!rect) return 100
    return 100 - Math.round(point.y / rect.height * 100)
  }

  function transformOpacity(opacity): string {
    return opacity.toFixed(2)
  }
}

/**
 * mocks
 */

import register, { DEFAULT_EXTENSIONS } from 'ignore-styles'
import { exts as styleExts, register as styleRegister } from './style-mock'
import { exts as markdownExts, register as markdownRegister } from './markdown-mock'
import polyfill from 'css-typed-om'

const exts = []
      .concat(DEFAULT_EXTENSIONS)
      .concat(styleExts)
      .concat(markdownExts)

register(exts, (module, filename) => {
  styleRegister(module, filename)
  markdownRegister(module, filename)
})

window && polyfill(window)
global.requestAnimationFrame = window.requestAnimationFrame = function() {}
window.CSSStyleValue.parse = function() {}

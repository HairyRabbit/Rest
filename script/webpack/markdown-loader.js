/**
 * markdown loader
 *
 * convert markdown file to react stateless component
 */

import { getOptions } from 'loader-utils'
import { parse } from 'remark'
import { highlight, languages } from 'prismjs'
import components from 'prismjs/components'
import loadLanguages from 'prismjs/components/'

loadLanguages(Object.keys(components.languages).filter(lang => 'meta' !== lang))

function loader(content, map, meta) {
  this.cacheable(true)
  const options = getOptions(this)
  const ast = parse(content)
  const transform = createTransformer(options)
  return transform(ast)
}

const defaultComponents = {
  root: children => `<div>${children}</div>`,
  h1: children => `<h1>${children}</h1>`,
  h2: children => `<h2>${children}</h2>`,
  h3: children => `<h3>${children}</h3>`,
  h4: children => `<h4>${children}</h4>`,
  h5: children => `<h5>${children}</h5>`,
  h6: children => `<h6>${children}</h6>`,
  code: children => `<pre>${children}</pre>`
}

function createTransformer({ components, preload = '' } = {}) {
  const hosit = []
  const comps = { ...defaultComponents, ...components }

  return function transform({ type, ...node } = {}, { shouldEscape } = {}) {
    switch(type) {
      case 'root': {
        const { children } = node
        const child = children.map(transform)

        return [
          `import * as React from 'react'`,
          preload,
          hosit.join('\n'),
          `export default () => (\n${comps.root(child.join('\n'))}\n)`
        ].join('\n\n')
      }

      case 'heading': {
        const { depth, children } = node
        const child = children.map(c => transform(c, { shouldEscape: true }))

        return comps[`h${depth}`](child.join('\n'))
      }

      case 'html': {
        const { value } = node

        if(!shouldEscape) return value

        return `{\`${value}\`}`
      }

      case 'code': {
        const { lang, value } = node

        switch(lang) {
          case 'code': {
            hosit.push(value)
            return ''
          }

          default: {
            const hl = highlight(value, languages[lang], lang)
                  .replace(/class/g, 'className')
                  .replace(/(\{|\})/g, '{"$1"}')
                  .replace(/>(\s+)</g, '>{`$1`}<')

            return comps.code(`<code className='language-${lang}'>${hl}</code>`)
          }
        }
      }

      case 'text': {
        const { value } = node

        return `{\`${value}\`}`
      }

      default:
        const { children } = node
        const child = children && children.map(transform) || ''

        return child.join('\n')
    }
  }
}


/// export

export default loader

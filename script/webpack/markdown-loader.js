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
import html2jsx from 'htmltojsx'

loadLanguages(Object.keys(components.languages).filter(lang => 'meta' !== lang))

const html2jsxConvert = new html2jsx({
  createClass: false
})

function loader(content, map, meta) {
  this.cacheable(true)
  this.addDependency(__filename)
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
  code: children => `<pre>${children}</pre>`,
  paragraph: children => `<p>${children}</p>`,
  inlineCode: children => `<code>{\`${children}\`}</code>`,
  link: (href, children) => `<a href="${href}">${children}</a>`,
  list: children => `<ul>${children}</ul>`,
  listItem: children => `<li>${children}</li>`
}

function createTransformer({ components, preload = '', wrapperExport } = {}) {
  const hosit = []
  const inject = []
  const comps = { ...defaultComponents, ...components }

  return function transform({ type, ...node } = {}, { shouldEscape } = {}) {
    switch(type) {
      case 'root': {
        const { children } = node
        const child = children.map(transform)

        return [
          `import * as React from 'react'`,
          preload,
          hosit.length && hosit.join('\n'),

          `function MDXComponent(props) { `,
          inject.length && inject.join('\n'),
          `  return (\n${comps.root(child.join('\n'))}\n)`,
          `}`,
          `export default ${wrapperExport ? wrapperExport('MDXComponent') : 'MDXComponent'}`
        ].filter(Boolean).join('\n\n')
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

          case 'code.inject': {
            inject.push(value)
            return ''
          }

          default: {
            const la = languages[lang] ? lang : 'extends'
            const hl = highlight(value, languages[la], la)
            const wrap = `<pre><code class='language-${la}'>${hl}</code></pre>`
            const jsx = html2jsxConvert.convert(wrap)
            return comps.code(jsx)
          }
        }
      }

      case 'inlineCode': {
        const { value } = node
        return comps.inlineCode(value)
      }

      case 'text': {
        const { value } = node

        return `{\`${value}\`}`
      }

      case 'paragraph': {
        const { children } = node
        const child = children.map(c => transform(c, { shouldEscape: true }))
        return comps.paragraph(child.join('\n'))
      }

      case 'list': {
        const { children } = node
        const child = children.map(c => transform(c, { shouldEscape: true }))
        return comps.list(child.join('\n'))
      }

      case 'listItem': {
        const { children } = node
        const child = children.map(c => transform(c, { shouldEscape: true }))
        return comps.listItem(child.join('\n'))
      }

      case 'link': {
        const { title, url, children } = node
        const child = children.map(c => transform(c, { shouldEscape: true }))
        return comps.link(url, child.join('\n'))
      }

      default: {
        console.log(type, node)
        const { children, value } = node
        const child = children && children.map(transform) || []
        return child.join('\n')
      }
    }
  }
}


/// export

export default loader

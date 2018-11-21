/**
 * ensure-node
 *
 * get node if not found by id
 *
 * @flow
 */

/// code

type Options = {
  parent?: HTMLElement | string,
  tag?: string
}

function ensureNode(id: string, options?: Options = {}): HTMLElement {
  if(!document) throw new Error(
    `document not found, Can't run browser?`
  )

  const node = document.getElementById(id)
  if(node) return node

  /**
   * can't find node, so create one
   */
  const { parent = document.body, tag = 'div', beforeMount } = options
  const mount = document.createElement(tag)
  mount.id = id
  if('function' === typeof beforeMount) beforeMount(mount)

  const p = 'string' === typeof parent
        ? document.querySelector(parent)
        : parent
  if(!p) {
    throw new Error(
      `Mount node not found, "${String(p)}"`
    )
  }

  p.appendChild(mount)
  return mount
}


/// export

export default ensureNode


/// test

import assert from 'assert'

describe('Function ensureNode', () => {
  beforeEach(() => {
    // $FlowFixMe
    document.body.innerHTML = ''
  })

  it('should return node when exists', () => {
    const node = document.createElement('div')
    node.id = 'foo'
    // $FlowFixMe
    document.body.appendChild(node)
    assert.deepStrictEqual(node, ensureNode('foo'))
  })

  it('should return node when not exists', () => {
    const node = ensureNode('foo')
    assert.deepStrictEqual(node, document.getElementById('foo'))
  })

  it('should return node when not exists, append on custom node', () => {
    const container = document.createElement('div')
    container.id = 'foo'
    // $FlowFixMe
    document.body.appendChild(container)
    const node = ensureNode('bar', { parent: container })
    assert.deepStrictEqual(node, document.getElementById('bar'))
    assert.deepStrictEqual(node.parentNode, container)
  })

  it('should return node when not exists, custom tag', () => {
    const node = ensureNode('foo', { tag: 'section' })
    assert.deepStrictEqual(node, document.getElementById('foo'))
    assert.deepStrictEqual(node.tagName, 'SECTION')
  })

  it('should throw when parent node not found', () => {
    const container = document.getElementById('div')
    assert.throws(
      // $FlowFixMe
      () => { ensureNode('foo', { parent: container }) },
      /node not found/
    )
  })
})

/**
 * ensure-node
 *
 * get node if not found by id
 *
 * @flow
 */

/// code

function ensureNode(id: string, parent?: HTMLElement = document.body, tag?: string = 'div'): HTMLElement {
  const node = document.getElementById(id)
  if(node) return node

  /**
   * can't find node, so create one
   */
  const mount = document.createElement(tag)
  mount.id = id

  if(!parent) {
    throw new Error(
      `Mount node not found, "${parent}"`
    )
  }

  parent.appendChild(mount)
  return mount
}


/// export

export default ensureNode


/// test

import assert from 'assert'

describe('Function ensureNode', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should return node when exists', () => {
    const node = document.createElement('div')
    node.id = 'foo'
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
    document.body.appendChild(container)
    const node = ensureNode('bar', container)
    assert.deepStrictEqual(node, document.getElementById('bar'))
    assert.deepStrictEqual(node.parentNode, container)
  })

  it('should return node when not exists, custom tag', () => {
    const node = ensureNode('foo', undefined, 'section')
    assert.deepStrictEqual(node, document.getElementById('foo'))
    assert.deepStrictEqual(node.tagName, 'SECTION')
  })

  it('should throw when parent node not found', () => {
    const container = document.getElementById('div')
    assert.throws(() => {
      ensureNode('foo', container)
    }, /node not found/)
  })
})

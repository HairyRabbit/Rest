/**
 * ensure-node
 *
 * mount node if not found by id
 *
 * @flow
 */

/// code

function ensureNode(id: string, parent?: HTMLElement = document.body): HTMLElement {
  const node = document.getElementById(id)
  if(node) return node

  /**
   * can't find
   */
  const mount = document.createElement('div')
  mount.id = id

  if(!parent) {
    throw new Error(
      `Mount node not provide, "${parent}"`
    )
  }

  parent.appendChild(mount)
  return mount
}


/// export

export default ensureNode

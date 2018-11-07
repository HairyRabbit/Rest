/**
 * <CollectView /> common pattern for collect data. If collect
 * was empty, render <EmptyView /> otherwise render <ItemView />.
 *
 * @flow
 */

import * as React from 'react'


/// code

export type Props<T> = {
  value: Array<T>,
  emptyView?: React.Node,
  itemView?: React.Node,
  tags?: {
    list?: string,
    item?: string
  },
  classNames?: {
    list?: string,
    item?: string
  }
}

export default function CollectView<T>({ value = [], emptyView: EmptyView = null, itemView: ItemView = 'div' }: Props<T> = {}, tags, classNames): React.Node {
  if(!Array.isArray(value)) throw new Error(`<CollectView /> value should be array`)
  if(!value.length) return (<EmptyView />)

  const [ ListWrapper, ItemWrapper ] = tags
        ? [tags.list || 'ul', tags.item || 'li']
        : ['ul', 'li']

  return (
    <ListWrapper>
      {value.map((item, idx) => {
        return (<ItemWrapper key={idx}><ItemView {...item} /></ItemWrapper>)
      })}
    </ListWrapper>
  )
}

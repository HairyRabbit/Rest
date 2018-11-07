/**
 * <CollectView /> common pattern for collect data. If collect
 * was empty, render <EmptyView /> otherwise render <ItemView />.
 *
 * @flow
 */

import * as React from 'react'
import { classnames as cs } from '../../util'
import style from '../../style/reset.css'


/// code

export type Props<T> = {
  value: Array<T>,
  emptyView?: React.Node,
  itemView?: React.Node,
  tags?: {
    list?: string,
    item?: string
  },
  className?: string,
  classNames?: {
    list?: string,
    item?: string
  }
}

export function DefaultEmptyView() {
  return null
}

export default function CollectView<T>({ value = [], emptyView: EmptyView = DefaultEmptyView, itemView: ItemView = 'div', tags, classNames = {}, className, ...props }: Props<T> = {}): React.Node {
  if(value && !Array.isArray(value)) throw new Error(`<CollectView /> value should be array`)
  /**
   * `null`, `undefined`, `[]` render empty view
   */
  if(!value || !value.length) return (<EmptyView />)

  const [ ListWrapper, ItemWrapper ] = tags
        ? [tags.list || 'ul', tags.item || 'li']
        : ['ul', 'li']

  return (
    <ListWrapper className={cs(style.list, className, classNames.list)} {...props}>
      {value.map((item, idx) => {
        return (
          <ItemWrapper key={idx} className={cs(classNames.item)}>
            <ItemView {...item} />
          </ItemWrapper>)
      })}
    </ListWrapper>
  )
}

/**
 * <Table />
 *
 * @flow
 */

import * as React from 'react'
import { groupBy, keyBy, pick } from 'lodash'
import { classnames as cs } from '../../util'
import style from './style.css'


/// code

export type Props<T> = {
  header?: React.Component<*>,
  footer?: React.Component<*>,
  caption?: string,             // @todo
  cols?: string,
  value?: Array<T>,
  children?: React.Component<*>,
  emptyView?: React.Component<*>,
  className?: string,
}

export default function Table({ value = [], header, footer, children, className, ...props }: Props = {}): React.Node {
  const isEmpty = value.length === 0
  if(isEmpty) return <div>no data display</div>

  const index = React.Children.map(children, (child, idx) => ({
    component: <th className={style.th} key={idx}>{child.props.children}</th>,
    column: child.props.value
  })).reduce((acc, curr) => {
    acc.components.push(curr.component)
    acc.columns.push(curr.column)
    return acc
  }, { components: [], columns: [] })

  return (
    <table className={cs(style.main, className)} {...props}>
      <thead className={style.header}><tr>{index.components}</tr></thead>
      <tbody>{bodyView()}</tbody>
      <tfoot></tfoot>
    </table>
  )

  function bodyView() {
    return value.map((data, idx) => {
      return (
        <tr className={style.row} key={idx}>
          {index.columns.map((column, idx) => (
            <td className={style.cell} key={idx}>{data[column]}</td>
          ))}
        </tr>
      )
    })
  }
}

Table.Col = Col

export function Col() {
  return null
}

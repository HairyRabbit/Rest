/**
 * <FormItem /> form control view, include label, field, and
 * helper three parts.
 *
 * @flow
 */


import * as React from 'react'
import { Layout } from '../'


/// code

export type Props = {
  label?: string,
  required?: boolean | string,
  children?: React.Node
}

export default function FormItem({ label, required, children, ...props }: Props = {}): React.Node {
  return (
    <Layout {...props}>

    </Layout>
  )
}

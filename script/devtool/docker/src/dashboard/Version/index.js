/**
 * <Version /> view, part of dashboard
 *
 * @flow
 */

import * as React from 'react'
import { Card, Layout, Icon } from '@component'
import { toDateAgo } from '@util'
import style from './style.css'


/// code

export default function Version({ ApiVersion, Arch, BuildTime, GitCommit, GoVersion, KernelVersion, MinAPIVersion, Os, Version }) {
  return (
    <Card className={style.card}>
      <Card.Section>
        Versions
      </Card.Section>
      <Card.Section>
        <Layout vertical>
          <VersionRowView icon="Core" label="OS/Arch/Kernel">
            {Os} {Arch}/{KernelVersion}
          </VersionRowView>

          <VersionRowView icon="Docker" label="Docker/Api">
            {Version} {ApiVersion}/{MinAPIVersion}
          </VersionRowView>

          <VersionRowView icon="golang" label="Go version">
            {GoVersion}
          </VersionRowView>

          <VersionRowView icon="build" label="Build info">
            {GitCommit} at {toDateAgo(new Date(BuildTime))}
          </VersionRowView>
        </Layout>
      </Card.Section>
    </Card>
  )
}

type VersionRowViewProps = {
  icon?: string,
  key?: string,
  children?: React.Node
}

function VersionRowView({ icon, label, children }: VersionRowViewProps = {}): React.Node {
  return (
    <Layout align=",center" size="41.6667%:1">
      <Layout align=",center" gutter="xs" size="0:1">
        <Icon value={icon} className={style.labelIcon} />
        <span className={style.label}>{label}</span>
      </Layout>
      <span>{children}</span>
    </Layout>
  )
}

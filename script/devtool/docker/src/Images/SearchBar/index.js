/**
 * <SearchBar />
 *
 * @flow
 */

import * as React from 'react'
import { connect } from 'react-redux'
import { FormItem, CheckBox, Switch, Layout, TagsInput, TextField, Button, Icon } from '~component'
import { api, classnames as cs } from '~util'
import { ActionType as QueryParamsActionType } from '../../core/images/searchBar/queryParams'
import { ActionType as ResultsFilterActionType } from '../../core/images/searchBar/resultsFilter'
import style from './style.css'

/// code

export function SearchBar({ value, changeHandle, ...props }) {
  const [ toggle, setToggle ] = React.useState(false)
  return (
    <>
      <Layout nogutter align=",center" size="0:1:0">
        <label className={style.helper} htmlFor="filter">
          <Icon size="lg" value="filter" className={style.icon} />
        </label>
        <TextField placeholder="Type a regexp to filter the results"
                   onChange={changeHandle}
                   className={style.field}
                   value={value}
                   name="filter" />
        <div className={style.helper} onClick={() => setToggle(!toggle)}>
          <Icon value="cog" size="xl" />
        </div>
      </Layout>
      {toggle && <SearchFilters {...props} />}
    </>
  )
}

function SearchFilters({ queryParams: { all, digests, before, reference, since, label, dangling }, updateQueryParams, clearQueryParams, loadData }) {
  return (
    <div className={style.container}>
      <Layout vertical>
        <Section header="Set Query Conditions">
          <Layout vertical gutter="xs" className={style.between}>
            <Layout vertical gutter="sm">
              <FormItem type="between"
                        label="All"
                        helper="Show all images. Only images from a final layer (no children) are shown by default.">
                <Switch name="all"
                        checked={all}
                        onChange={evt => updateQueryParams('all', evt.target.checked)} />
              </FormItem>
              <FormItem type="between"
                        label="Digests"
                        helper="Show digest information as a RepoDigests field on each image.">
                <Switch name="digests"
                        checked={digests}
                        onChange={evt => updateQueryParams('digests', evt.target.checked)} />
              </FormItem>
            </Layout>
          </Layout>
        </Section>

        <Section header="Configure Filters">
          <Layout vertical gutter="sm">
            <FormItem type="horizontal" label="Before">
              <TagsInput name="before"
                         placeholder="Type before"
                         value={before.value}
                         tags={before.tags}
                         onBlur={(evt, tags) => updateQueryParams('before', { tags, value: '' })}
                         onChange={evt => updateQueryParams('before', { tags: before.tags, value: evt.target.value })}
                         onTagsChange={tags => updateQueryParams('before', { tags, value: '' })} />
            </FormItem>
            <FormItem type="horizontal" label="Reference">
              <TextField name="reference"
                         placeholder="Type reference"
                         value={reference.value}
                         onChange={evt => updateQueryParams('reference', { tags: reference.tags, value: evt.target.value })} />
            </FormItem>
            <FormItem type="horizontal" label="Since">
              <TextField name="since"
                         placeholder="Type since"
                         value={since.value}
                         onChange={evt => updateQueryParams('since', { tags: since.tags, value: evt.target.value })} />
            </FormItem>
            <FormItem type="horizontal" label="Dangling">
              <CheckBox name="dangling"
                        checked={dangling}
                        onChange={evt => updateQueryParams('dangling', CheckBox.nextState(dangling))} />
            </FormItem>
            <FormItem type="horizontal"
                      label="Label"
                      helper="label=key or label='key=value' of an image label">
              <TextField name="label"
                         placeholder="Type label"
                         value={label.value}
                         onChange={evt => updateQueryParams('label', { tags: label.tags, value: evt.target.value })} />
            </FormItem>
            <FormItem type="horizontal">
              <Layout size="0">
                <Button onClick={() => {
                  api.get('images/json', { params: {
                    all,
                    digests,
                    filters: JSON.stringify({
                      before: before.tags.length
                        ? before.tags.map(tag => tag.value)
                        : undefined,
                      reference: reference.tags.length ? reference.tags : undefined,
                      since: since.tags.length ? since.tags : undefined,
                      label: label.tags.length ? label.tags : undefined,
                      dangling: undefined !== dangling
                        ? [JSON.stringify(dangling)]
                        : undefined
                    })
                  }}).then(loadData)
                }}>Search</Button>
                <Button theme="default" onClick={clearQueryParams}>
                  Reset
                </Button>
              </Layout>
            </FormItem>
          </Layout>
        </Section>
      </Layout>
    </div>
  )
}

function Section({ header, children }): React.Node {
  return (
    <Layout vertical>
      <header className={style.header}>{header}</header>
      {children}
    </Layout>
  )
}

function mapp(state) {
  return {
    value: state.ui.images.searchBar.resultsFilter,
    queryParams: state.ui.images.searchBar.queryParams
  }
}

function mapd(dispatch) {
  return {
    changeHandle: evt => {
      const value = evt.target.value
      dispatch({ type: ResultsFilterActionType.SetValue, payload: value })
      dispatch({ type: 'FilterData', payload(data) {
        if(!value.trim()) return true
        const re = new RegExp(value)
        const { RepoTags } = data
        const [name, tag] = RepoTags && RepoTags.length
              ? RepoTags[0].split(':')
              : 'undefined:undefined'
        return re.test(name)
      } })
    },
    updateQueryParams(field, value) {
      dispatch({ type: QueryParamsActionType.SetValue, payload: { field, value } })
    },
    clearQueryParams() {
      dispatch({ type: QueryParamsActionType.ResetValues })
    },
    loadData(data) {
      dispatch({ type: 'LoadData', payload: data })
    }
  }
}

export default connect(mapp, mapd)(SearchBar)

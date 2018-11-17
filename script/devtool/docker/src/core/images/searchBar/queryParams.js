/**
 * query params form state reducer
 *
 * @flow
 */

import type { TagEntity } from '@component/TagsInput'


/// code

type Tags = {
  tags: Array<TagEntity>,
  value: string
}

type Model = {
  all: boolean,
  digests: boolean,
  before: Tags,
  reference: Tags,
  since: Tags,
  dangling: undefined | boolean,
  label: Tags
}

const init: Model = {
  all: false,
  digests: false,
  before: {
    tags: [],
    value: ''
  },
  reference: {
    tags: [],
    value: ''
  },
  since: {
    tags: [],
    value: ''
  },
  dangling: undefined,
  label: {
    tags: [],
    value: ''
  }
}

const namespace = '@ui/images/searchBar/queryParams'
export const ActionType = {
  SetValue: `${namespace}/SetValue`,
  ResetValues: `${namespace}/ResetValues`
}

type Action =
  | { type: '@ui/images/searchBar/queryParams/SetValue', payload: { field: string, value: any } }
  | { type: '@ui/images/searchBar/queryParams/ResetValues' }

export default function reduceQueryParams(model: Model = init, action: Action): Model {
  switch(action.type) {
    case ActionType.SetValue:
      return {
        ...model,
        [action.payload.field]: action.payload.value
      }
    case ActionType.ResetValues: return init
    default: return model
  }
}

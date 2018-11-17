/**
 * result filter text field state
 *
 * @flow
 */

/// code

type Model = string
const init: Model = ''

const namespace = '@ui/images/searchBar'
export const ActionType = {
  SetValue: `${namespace}/SetValue`
}

type Action =
  | { type: 'setValue', payload: string }

export default function filterResults(model: Model = init, action: Action): Model {
  switch(action.type) {
    case ActionType.SetValue: return action.payload
    default: return model
  }
}

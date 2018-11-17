/**
 * push tag state for controlled <TagsGroup /> component
 *
 * @flow
 */

type Model = {
  creator: string,
  isCreatorEdit: boolean
}

const init: Model = {
  creator: 'new tag',
  isCreatorEdit: false
}

const namespace = '@ui/image'
export const ActionType = {
  SetEdit: `${namespace}/SetEdit`,
  SetValue: `${namespace}/SetValue`
}

export default function updatePushTagState(model: Model = init, action): Model {
  switch(action.type) {
    case ActionType.SetEdit: return {
      ...model,
      isCreatorEdit: action.payload
    }
    case ActionType.SetValue: return {
      ...model,
      creator: action.payload
    }
    default: return model
  }
}

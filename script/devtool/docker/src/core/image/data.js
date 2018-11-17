/**
 * load image inspect data from "/images/{name}/json"
 *
 * @flow
 */

type Model = ?Object

const init: Model = null

const namespace = '@ui/image'
export const ActionType = {
  LoadData: `${namespace}/LoadData`,
  PushTag: `${namespace}/PushTag`
}

export default function loadData(model: Model = init, action: Action): Model {
  switch(action.type) {
    case ActionType.LoadData: return action.payload
    case ActionType.PushTag: return {
      ...model,
      RepoTags: [
        ...model.RepoTags,
        action.payload
      ]
    }
    default: return model
  }
}

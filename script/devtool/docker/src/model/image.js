/**
 * Image Model
 *
 * @model
 * @flow
 */

export type Model = {
  Id: string,
  ParentId: string,
  RepoTags: Array<string>,
  RepoDigests: Array<string>,
  Created: number,
  Size: number,
  SharedSize: number,
  VirtualSize: number,
  // Labels: Labels,
  Containers: number
}

export default {

}

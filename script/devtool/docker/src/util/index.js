/**
 * utils for docker
 *
 * @flow
 */

export function parseImageId(input: string, { length = 20, len = 7 }: Object = {}): string {
  const [ digest, id ] = input.split(':')
  return {
    digest,
    id,
    short: id.substr(0, length),
    shorter: id.substr(0, len)
  }
}

function isUnname(input): boolean {
  return '<none>' === input
}

function transformDockerImageTag(input: string): string {
  if(isUnname(input)) return 'none'
  return input
}

function transformDockerImageName(input: string): string {
  if(isUnname(input)) return 'Unknow'
  return input
}

export function parseImageRepoTag(repotag: string) {
  const [ repo, tag ] = repotag.split(':')
  const [ user, image ] = repo.split('/')
  return {
    repo,
    user: user || image,
    image: image || user,
    tag
  }
}

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

export function transformDockerContainerId(id: string): string {
  return id.substr(0, 12)
}

export function transformDockerContainerName(name: string): string {
  return name.substr(1)
}

export function transformDockerContainerPorts(ports: { [string]: string }) {
  return Object.keys(ports).map(port => port.split('/'))
}

export function transformDockerContainerVolumes(volumes: { [string]: string }) {
  return Object.keys(volumes)
}

export function transformDockerContainerNetWorks(networks) {
  return Object.keys(networks)
}

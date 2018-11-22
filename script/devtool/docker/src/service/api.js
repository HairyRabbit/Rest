/**
 * docker restful api call
 *
 * @flow
 */

import { api } from '@util'

export function ping() {
  return api.get('_ping')
}

export function getInfo() {
  return api.get('info')
}

export function getVersion() {
  return api.get('version')
}

export function getData() {
  return api.get('system/df')
}

export function getNetworks() {
  return api.get('networks')
}

export function getContainers(params) {
  return api.get('containers/json', { params })
}

export function getContainerLogs(id, params) {
  return api.get(`containers/${id}/logs`, {
    params: {
      stdout: true,
      stderr: true,
      ...params
    }
  })
}

export function createContainerExec(id, body) {
  return api.post(`containers/${id}/exec`, {
    body: {
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      DetachKeys: 'ctrl-p,ctrl-q',
      Tty: false,
      ...body
    }
  })
}

export function startExec(id, body) {
  return api.post(`exec/${id}/start`, {
    body: {
      Detach: false,
      Tty: false,
      ...body
    },
    responseParser(res) {
      console.log(res)
      return res.text()
    }
  })
}

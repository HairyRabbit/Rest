/**
 * docker restful api call
 *
 * @flow
 */

import { api } from '@util'

export function ping() {
  return api.get('_ping')
}

export function info() {
  return api.get('info')
}

export function version() {
  return api.get('version')
}

export function data() {
  return api.get('system/df')
}

export function networks() {
  return api.get('networks')
}

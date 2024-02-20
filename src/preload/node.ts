import { ipcRenderer } from 'electron'
import { StatusResult } from '../main/node/child'

type StatusResults = {
  coordinatorBeacon: StatusResult
  coordinatorValidator: StatusResult
  gwat: StatusResult
}
export interface NodeApi {
  start: () => Promise<StatusResults>
  stop: () => Promise<StatusResults>
}

export const node: NodeApi = {
  start: () => ipcRenderer.invoke('node:start'),
  stop: () => ipcRenderer.invoke('node:stop')
}

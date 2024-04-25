import { ipcRenderer } from 'electron'

import { NewNode } from '../main/models/node'

export const node = {
  start: (id: number) => ipcRenderer.invoke('node:start', id),
  stop: (id: number) => ipcRenderer.invoke('node:stop', id),
  restart: (id: number) => ipcRenderer.invoke('node:restart', id),
  getAll: () => ipcRenderer.invoke('node:getAll'),
  getById: (id: number) => ipcRenderer.invoke('node:getById', id),
  add: (newNode: NewNode) => ipcRenderer.invoke('node:add', newNode),
  remove: (ids: number[], withData = false) => ipcRenderer.invoke('node:delete', ids, withData),
  checkPorts: (ports: number[]) => ipcRenderer.invoke('node:checkPorts', ports)
}

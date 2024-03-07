import { ipcRenderer } from 'electron'

import { NewNode } from '../main/models/node'

export const node = {
  start: (id: number) => ipcRenderer.invoke('node:start', id),
  stop: (id: number) => ipcRenderer.invoke('node:stop', id),
  getAll: () => ipcRenderer.invoke('node:getAll'),
  getById: (id: number) => ipcRenderer.invoke('node:getById', id),
  add: (newNode: NewNode) => ipcRenderer.invoke('node:add', newNode)
}

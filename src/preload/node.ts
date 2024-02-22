import { ipcRenderer } from 'electron'

export const node = {
  start: (id: number) => ipcRenderer.invoke('node:start', id),
  stop: (id: number) => ipcRenderer.invoke('node:stop', id),
  getAll: () => ipcRenderer.invoke('node:getAll')
}

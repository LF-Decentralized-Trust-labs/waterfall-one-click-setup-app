import { ipcRenderer } from 'electron'
export interface API {
  start: () => Promise<void>
  stop: () => Promise<void>
}

export const api: API = {
  start: () => ipcRenderer.invoke('node:start'),
  stop: () => ipcRenderer.invoke('node:stop')
}

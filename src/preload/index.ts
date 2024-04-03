/// <reference types="./index.d.ts" />
import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { platform, homedir } from 'node:os'

import { node } from './node'
import { worker } from './worker'

const selectDirectory = (defaultPath?: string) =>
  ipcRenderer.invoke('os:selectDirectory', defaultPath)

const saveTextFile = (text: string, title?: string, fileName?: string) =>
  ipcRenderer.invoke('os:saveTextFile', text, title, fileName)

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', { ...electronAPI })
    contextBridge.exposeInMainWorld('node', node)
    contextBridge.exposeInMainWorld('worker', worker)
    contextBridge.exposeInMainWorld('os', {
      platform: getPlatform(),
      homedir: getHomeDir(),
      selectDirectory: selectDirectory,
      saveTextFile: saveTextFile,
      openExternal: shell.openExternal
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.node = node
  // @ts-ignore (define in dts)
  window.worker = worker
  // @ts-ignore (define in dts)
  window.os = {
    platform: getPlatform(),
    homedir: getHomeDir(),
    selectDirectory: selectDirectory,
    saveTextFile: saveTextFile,
    openExternal: shell.openExternal
  }
}

function getPlatform(): 'linux' | 'mac' | 'win' | null {
  switch (platform()) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return 'linux'
    case 'darwin':
    case 'sunos':
      return 'mac'
    case 'win32':
      return 'win'
    default:
      return null
  }
}

function getHomeDir() {
  return homedir()
}

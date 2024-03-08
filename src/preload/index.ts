/// <reference types="./index.d.ts" />
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { platform, homedir } from 'node:os'

import { node } from './node'

const selectDirectory = (defaultPath?: string) =>
  ipcRenderer.invoke('os:selectDirectory', defaultPath)

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', { ...electronAPI })
    contextBridge.exposeInMainWorld('node', node)
    contextBridge.exposeInMainWorld('os', {
      platform: getPlatform(),
      homedir: getHomeDir(),
      selectDirectory: selectDirectory
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
  window.os = { platform: getPlatform(), homedir: getHomeDir(), selectDirectory: selectDirectory }
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

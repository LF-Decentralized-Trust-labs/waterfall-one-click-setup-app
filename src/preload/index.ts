/// <reference types="./index.d.ts" />
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { platform, homedir } from 'node:os'
import path from 'node:path'
import https from 'node:https'

import { node } from './node'
import { worker } from './worker'

const selectDirectory = (defaultPath?: string) =>
  ipcRenderer.invoke('os:selectDirectory', defaultPath)
const selectFile = (defaultPath?: string, filters?: { name: string; extensions: string[] }[]) =>
  ipcRenderer.invoke('os:selectFile', defaultPath, filters)

const saveTextFile = (text: string, title?: string, fileName?: string) =>
  ipcRenderer.invoke('os:saveTextFile', text, title, fileName)

const openExternal = (url: string) => ipcRenderer.invoke('os:openExternal', url)

const quit = () => ipcRenderer.invoke('app:quit')

const fetchState = () => ipcRenderer.invoke('app:state')

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', { ...electronAPI })
    contextBridge.exposeInMainWorld('node', node)
    contextBridge.exposeInMainWorld('worker', worker)
    contextBridge.exposeInMainWorld('app', {
      quit,
      fetchState
    })
    contextBridge.exposeInMainWorld('os', {
      platform: getPlatform(),
      homedir: getHomeDir(),
      selectDirectory: selectDirectory,
      selectFile: selectFile,
      saveTextFile: saveTextFile,
      openExternal: openExternal,
      path,
      fetchJSON
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
    selectFile: selectFile,
    saveTextFile: saveTextFile,
    openExternal: openExternal,
    path,
    fetchJSON
  }
  // @ts-ignore (define in dts)
  window.app = { quit, fetchState }
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

function fetchJSON(url: string): Promise<object> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      family: 4
    }
    const req = https.get(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    })
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    req.on('error', (e) => {
      reject(e)
    })
  })
}

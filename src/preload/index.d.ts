/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { ElectronAPI } from '@electron-toolkit/preload'
import path from 'node:path'
import { node } from './node'
import { worker } from './worker'

type State = {
  version: string
}
declare global {
  interface Window {
    electron: ElectronAPI
    node: node
    worker: worker
    os: {
      platform: 'linux' | 'mac' | 'win' | null
      homedir: string
      selectDirectory: (defaultPath?: string) => Promise<string | null>
      selectFile: (
        defaultPath?: string,
        filters?: { name: string; extensions: string[] }[]
      ) => Promise<string | null>
      saveTextFile: (text: string, title?: string, fileName?: string) => Promise<boolean>
      openExternal: (url: string) => void
      path: path
      fetchJSON: (url: string) => Promise<object>
    }
    app: {
      quit: () => void
      fetchState: () => Promise<State>
    }
  }
}

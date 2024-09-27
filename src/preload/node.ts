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

import { ipcRenderer } from 'electron'

import { addParams, ActionTxType } from '../main/worker'
export const worker = {
  genMnemonic: () => ipcRenderer.invoke('worker:genMnemonic'),
  getAll: () => ipcRenderer.invoke('worker:getAll'),
  getById: (id: number) => ipcRenderer.invoke('worker:getById', id),
  getAllByNodeId: (id: number) => ipcRenderer.invoke('worker:getAllByNodeId', id),
  add: (data: addParams) => ipcRenderer.invoke('worker:add', data),
  getActionTx: (action: ActionTxType, id: number, amount?: string) =>
    ipcRenderer.invoke('worker:getActionTx', action, id, amount),
  remove: (ids: number[]) => ipcRenderer.invoke('worker:delete', ids)
}

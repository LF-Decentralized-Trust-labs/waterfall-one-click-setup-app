import { Worker, ActionTxType, ActionTx } from '../types/workers'

export const genMnemonic = async (): Promise<string> => {
  return await window.worker.genMnemonic()
}

export const getAll = async (): Promise<Worker[]> => {
  return await window.worker.getAll()
}

export const getById = async (id: number | bigint): Promise<Worker> => {
  return await window.worker.getById(id)
}

export const getAllByNodeId = async (id: number | bigint): Promise<Worker[]> => {
  return await window.worker.getAllByNodeId(id)
}

export const add = async (data: {
  nodeId: number | bigint
  mnemonic?: string
  amount?: number
  withdrawalAddress?: string
  depositData?: string
  delegateRules?: string
}): Promise<{ status: 'success' | 'error'; message?: string; data?: Worker[] }> => {
  return await window.worker.add(data)
}

export const getActionTx = async (
  action: ActionTxType,
  id: number | bigint,
  amount?: string
): Promise<ActionTx> => {
  return await window.worker.getActionTx(action, id, amount)
}

export const remove = async (ids: (number | bigint)[]) => {
  return await window.worker.remove(ids)
}

export const sendActionTx = async (action: ActionTxType, ids: (number | bigint)[], pk: string) => {
  return await window.worker.sendActionTx(action, ids, pk)
}

export const getDepositDataCount = async (path: string) => {
  return await window.worker.getDepositDataCount(path)
}
export const getDelegateRules = async (path: string) => {
  return await window.worker.getDelegateRules(path)
}

export const getBalance = async (address: string) => {
  return await window.worker.getBalance(address)
}

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
  mnemonic: string
  amount: number
  withdrawalAddress: string
}) => {
  return await window.worker.add(data)
}

export const getActionTx = async (
  action: ActionTxType,
  id: number | bigint,
  amount?: string
): Promise<ActionTx> => {
  return await window.worker.getActionTx(action, id, amount)
}

export const remove = async (ids: number[] | bigint[]) => {
  return await window.worker.remove(ids)
}

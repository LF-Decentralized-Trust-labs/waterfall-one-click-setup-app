import { Node, NewNode } from '@renderer/types/node'

export enum StatusResult {
  success = 'success',
  fail = 'fail'
}

export type StatusResults = {
  coordinatorBeacon: StatusResult
  coordinatorValidator: StatusResult
  validator: StatusResult
}

export const start = async (id: number | bigint): Promise<StatusResults> => {
  return await window.node.start(id)
}
export const stop = async (id: number | bigint): Promise<StatusResults> => {
  return await window.node.stop(id)
}

export const getAll = async (): Promise<Node[]> => {
  return await window.node.getAll()
}

export const getById = async (id: number | bigint): Promise<Node> => {
  return await window.node.getById(id)
}

export const add = async (newNode: NewNode): Promise<Node> => {
  return await window.node.add(newNode)
}

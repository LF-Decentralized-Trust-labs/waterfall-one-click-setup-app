export enum Network {
  testnet8 = 'testnet8'
}

export enum StatusResult {
  success = 'success',
  fail = 'fail'
}

export type StatusResults = {
  coordinatorBeacon: StatusResult
  coordinatorValidator: StatusResult
  validator: StatusResult
}

export enum Type {
  local = 'local',
  remote = 'remote'
}

export enum CoordinatorStatus {
  stopped = 'stopped',
  running = 'running'
}

export enum CoordinatorValidatorStatus {
  stopped = 'stopped',
  running = 'running'
}

export enum ValidatorStatus {
  stopped = 'stopped',
  running = 'running'
}

export interface NewNode {
  name: string
  network: Network
  type: Type
  locationDir: string
  coordinatorHttpApiPort?: number
  coordinatorHttpValidatorApiPort?: number
  coordinatorP2PTcpPort?: number
  coordinatorP2PUdpPort?: number
  validatorP2PPort?: number
  validatorHttpApiPort?: number
  validatorWsApiPort?: number
}

export interface Node extends NewNode {
  id: number | bigint
  coordinatorStatus: CoordinatorStatus
  coordinatorPeersCount: number
  coordinatorHeadSlot: bigint
  coordinatorSyncDistance: bigint
  coordinatorPreviousJustifiedEpoch: bigint
  coordinatorCurrentJustifiedEpoch: bigint
  coordinatorFinalizedEpoch: bigint
  coordinatorPid: number
  coordinatorValidatorStatus: CoordinatorValidatorStatus
  coordinatorValidatorPid: number
  validatorStatus: ValidatorStatus
  validatorPeersCount: number
  validatorHeadSlot: bigint
  validatorSyncDistance: bigint
  validatorFinalizedSlot: bigint
  validatorPid: number
  workersCount: number
  coordinatorHttpApiPort: number
  coordinatorHttpValidatorApiPort: number
  coordinatorP2PTcpPort: number
  coordinatorP2PUdpPort: number
  validatorP2PPort: number
  validatorHttpApiPort: number
  validatorWsApiPort: number
  createdAt: string
  updatedAt: string
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

export const add = async (newNode: NewNode): Promise<Node> => {
  return await window.node.add(newNode)
}

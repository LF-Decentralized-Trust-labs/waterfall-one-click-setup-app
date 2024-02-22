import log from 'electron-log/main'
import { db } from '../libs/db'
import {
  Network,
  COORDINATOR_HTTP_API_PORT,
  COORDINATOR_HTTP_VALIDATOR_API_PORT,
  COORDINATOR_P2P_TCP_PORT,
  COORDINATOR_P2P_UDP_PORT,
  VALIDATOR_HTTP_API_PORT,
  VALIDATOR_P2P_PORT,
  VALIDATOR_WS_API_PORT
} from '../libs/env'

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

export const insert = (fields: NewNode): Node | null => {
  const query = db.prepare(
    'INSERT INTO nodes (' +
      'name, network, type, locationDir, ' +
      'coordinatorHttpApiPort, coordinatorHttpValidatorApiPort, coordinatorP2PTcpPort, coordinatorP2PUdpPort, ' +
      'validatorP2PPort, validatorHttpApiPort, validatorWsApiPort' +
      ') VALUES (' +
      '@name, @network, @type, @locationDir, ' +
      '@coordinatorHttpApiPort, @coordinatorHttpValidatorApiPort, @coordinatorP2PTcpPort, @coordinatorP2PUdpPort, ' +
      '@validatorP2PPort, @validatorHttpApiPort, @validatorWsApiPort' +
      ')'
  )
  try {
    const res = query.run({
      ...fields,
      coordinatorHttpApiPort: fields.coordinatorHttpApiPort || COORDINATOR_HTTP_API_PORT,
      coordinatorHttpValidatorApiPort:
        fields.coordinatorHttpValidatorApiPort || COORDINATOR_HTTP_VALIDATOR_API_PORT,
      coordinatorP2PTcpPort: fields.coordinatorP2PTcpPort || COORDINATOR_P2P_TCP_PORT,
      coordinatorP2PUdpPort: fields.coordinatorP2PUdpPort || COORDINATOR_P2P_UDP_PORT,
      validatorP2PPort: fields.validatorP2PPort || VALIDATOR_P2P_PORT,
      validatorHttpApiPort: fields.validatorHttpApiPort || VALIDATOR_HTTP_API_PORT,
      validatorWsApiPort: fields.validatorWsApiPort || VALIDATOR_WS_API_PORT
    })
    if (res.changes === 0) {
      return null
    }
    return getById(res.lastInsertRowid)
  } catch (e) {
    log.error('node insert', e)
    return null
  }
}

export const getById = (id: number | bigint): Node => {
  const res = db.prepare('SELECT * FROM nodes WHERE id = ?')
  return res.get(id) as Node
}

export const getAll = (): Node[] => {
  const res = db.prepare('SELECT * FROM nodes')
  return res.all() as Node[]
}
export const remove = (id: number | bigint): boolean => {
  const query = db.prepare('DELETE FROM nodes WHERE id = ?')
  const res = query.run(id)
  return !!res.changes
}

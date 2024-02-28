import log from 'electron-log/main'
import Database from 'better-sqlite3'
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

type Database = ReturnType<typeof Database>
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

export interface Node {
  id: number | bigint
  name: string
  network: Network
  type: Type
  locationDir: string
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

type RequiredNewNodeFields = Pick<Node, 'name' | 'network' | 'type' | 'locationDir'>
type OptionalNewNodeFields = Partial<
  Pick<
    Node,
    | 'coordinatorHttpApiPort'
    | 'coordinatorHttpValidatorApiPort'
    | 'coordinatorP2PTcpPort'
    | 'coordinatorP2PUdpPort'
    | 'validatorP2PPort'
    | 'validatorHttpApiPort'
    | 'validatorWsApiPort'
  >
>
export interface NewNode extends RequiredNewNodeFields, OptionalNewNodeFields {}
export interface UpdateNode extends Partial<Omit<Node, 'id' | 'createdAt' | 'updatedAt'>> {}

class NodeModel {
  private db: Database | null = null
  constructor(db) {
    this.db = db
  }
  public insert(fields: NewNode): Node | null {
    if (!this.db) {
      return null
    }
    const query = this.db.prepare(
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
      return this.getById(res.lastInsertRowid)
    } catch (e) {
      log.error('node insert', e)
      return null
    }
  }

  getById(id: number | bigint): Node | null {
    if (!this.db) {
      return null
    }
    const res = this.db.prepare('SELECT * FROM nodes WHERE id = ?')
    return res.get(id) as Node
  }

  getAll(): Node[] {
    if (!this.db) {
      return []
    }
    const res = this.db.prepare('SELECT * FROM nodes')
    return res.all() as Node[]
  }
  remove(id: number | bigint): boolean {
    if (!this.db) {
      return false
    }
    const query = this.db.prepare('DELETE FROM nodes WHERE id = ?')
    const res = query.run(id)
    return !!res.changes
  }

  update(id: number | bigint, data: UpdateNode): boolean {
    if (!this.db) {
      return false
    }
    if (Object.keys(data).length === 0) return false

    const columns = Object.keys(data)
      .map((key) => `${key} = @${key}`)
      .join(', ')

    const query = this.db.prepare(`UPDATE nodes SET ${columns}  WHERE id = @id`)
    const res = query.run({
      ...data,
      id
    })
    return !!res.changes
  }
}
export default NodeModel

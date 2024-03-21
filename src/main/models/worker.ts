import log from 'electron-log/node'
import Database from 'better-sqlite3'
import NodeModel, { Node } from './node'

type Database = ReturnType<typeof Database>

export enum CoordinatorStatus {
  pending_initialized = 'pending_initialized',
  pending_queued = 'pending_queued',
  active_ongoing = 'active_ongoing',
  active_exiting = 'active_exiting',
  active_slashed = 'active_slashed',
  exited_unslashed = 'exited_unslashed',
  exited_slashed = 'exited_slashed',
  withdrawal_possible = 'withdrawal_possible',
  withdrawal_done = 'withdrawal_done'
}

export enum ValidatorStatus {
  pending_initialized = 'pending_initialized',
  pending_activation = 'pending_activation',
  active = 'active',
  pending_exiting = 'pending_exiting',
  exited = 'exited'
}

export interface WorkerStatus {
  coordinatorStatus: CoordinatorStatus
  coordinatorBalanceAmount: string
  coordinatorActivationEpoch: string
  coordinatorDeActivationEpoch: string
  validatorStatus: ValidatorStatus
  validatorBalanceAmount: string
  validatorActivationEpoch: string
  validatorDeActivationEpoch: string
  stakeAmount: string
}

export interface Worker extends WorkerStatus {
  id: number | bigint
  nodeId: number | bigint
  node?: Node
  number: number
  coordinatorPublicKey: string
  coordinatorBlockCreationCount: number
  coordinatorAttestationCreationCount: number
  validatorAddress: string
  validatorBlockCreationCount: number
  withdrawalAddress: string
  signature: string
  createdAt: string
  updatedAt: string
}

type RequiredNewWorkerFields = Pick<
  Worker,
  'nodeId' | 'coordinatorPublicKey' | 'validatorAddress' | 'withdrawalAddress' | 'signature'
>
type OptionalNewWorkerFields = Partial<
  Pick<
    Worker,
    | 'coordinatorStatus'
    | 'coordinatorBalanceAmount'
    | 'coordinatorActivationEpoch'
    | 'coordinatorDeActivationEpoch'
    | 'coordinatorBlockCreationCount'
    | 'coordinatorAttestationCreationCount'
    | 'validatorStatus'
    | 'validatorBalanceAmount'
    | 'validatorActivationEpoch'
    | 'validatorDeActivationEpoch'
    | 'validatorBlockCreationCount'
    | 'stakeAmount'
  >
>

export interface NewWorker extends RequiredNewWorkerFields, OptionalNewWorkerFields {}

export interface UpdateWorker extends Partial<Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface Options {
  withNode?: boolean
}

class WorkerModel {
  private db: Database | null = null

  constructor(db) {
    this.db = db
  }

  public insert(workers: NewWorker[], node: Node): Worker[] {
    if (!this.db) {
      return []
    }

    const insertWorkerQuery = this.db.prepare(
      `INSERT INTO workers (nodeId, coordinatorPublicKey, validatorAddress, withdrawalAddress, signature) VALUES (@nodeId, @coordinatorPublicKey, @validatorAddress, @withdrawalAddress, @signature)`
    )

    const updateNode = this.db.prepare(`UPDATE nodes SET memoHash = @memoHash  WHERE id = @id`)

    try {
      const query = this.db.transaction((workers) => {
        for (const worker of workers) {
          insertWorkerQuery.run(worker)
        }

        updateNode.run({ id: node.id, memoHash: node.memoHash })
      })
      const res = query(workers)
      console.log(res)
      const allWorkers = this.getByNodeId(node.id)
      return allWorkers.map((worker) => ({
        ...worker,
        node
      }))
    } catch (e) {
      log.error('worker insert', e)
      return []
    }
  }

  getById(id: number | bigint, options?: Options): Worker | null {
    if (!this.db) {
      return null
    }
    const res = this.db.prepare('SELECT * FROM workers WHERE id = ?')
    const worker = res.get(id) as Worker

    if (options?.withNode && worker) {
      const nodeModel = new NodeModel(this.db)
      const node = nodeModel.getById(worker.nodeId)
      if (node) {
        worker.node = node
      }
    }

    return worker
  }

  getByNodeId(nodeId: number | bigint, options?: Options): Worker[] {
    if (!this.db) {
      return []
    }
    const res = this.db.prepare('SELECT * FROM workers WHERE nodeId = ?')
    let workers = res.all(nodeId) as Worker[]

    if (options?.withNode && workers.length > 0) {
      const nodeModel = new NodeModel(this.db)
      const node = nodeModel.getById(nodeId)
      if (node) {
        workers = workers.map((worker) => ({
          ...worker,
          node
        }))
      }
    }
    return workers
  }

  getByNodeIdLast(nodeId: number | bigint): Worker | null {
    if (!this.db) {
      return null
    }
    const res = this.db.prepare('SELECT * FROM workers WHERE nodeId = ? ORDER BY number DESC')
    return res.get(nodeId) as Worker
  }

  getAll(options?: Options): Worker[] {
    if (!this.db) {
      return []
    }
    const res = this.db.prepare('SELECT * FROM workers')

    let workers = res.all() as Worker[]

    if (options?.withNode && workers.length > 0) {
      const nodeModel = new NodeModel(this.db)
      const nodes = nodeModel.getAllByIds([...new Set(workers.map((worker) => worker.nodeId))])
      const nodesObject = {}
      nodes.forEach((node) => {
        nodesObject[node.id.toString()] = node
      })

      workers = workers.map((worker) => ({
        ...worker,
        node: nodesObject[worker.nodeId.toString()]
      }))
    }

    return workers
  }

  remove(id: number | bigint): boolean {
    if (!this.db) {
      return false
    }
    const query = this.db.prepare('DELETE FROM workers WHERE id = ?')
    const res = query.run(id)
    return !!res.changes
  }

  update(id: number | bigint, data: UpdateWorker): boolean {
    if (!this.db) {
      return false
    }
    if (Object.keys(data).length === 0) return false

    const columns = Object.keys(data)
      .map((key) => `${key} = @${key}`)
      .join(', ')

    const query = this.db.prepare(`UPDATE workers SET ${columns}  WHERE id = @id`)
    const res = query.run({
      ...data,
      id
    })
    return !!res.changes
  }
}

export default WorkerModel

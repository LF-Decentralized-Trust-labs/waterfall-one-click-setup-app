import { parentPort, workerData } from 'worker_threads'
import log from 'electron-log/node'
import { getMain } from '../libs/db'
import AppEnv from '../libs/appEnv'
import NodeModel, { Type as NodeType, CoordinatorStatus, ValidatorStatus } from '../models/node'
import WorkerModel from '../models/worker'
import LocalNode from '../node/local'
import { areObjectsEqual } from '../helpers/common'

const port = parentPort
if (!port) throw new Error('IllegalState')

interface ParentMessage {
  type: 'start' | 'stop'
}

class StatusMonitoring {
  private timeout: number = 4000
  private appEnv: AppEnv
  private nodeModel: NodeModel
  private workerModel: WorkerModel
  private interval: NodeJS.Timeout | null = null
  private isStart = false

  constructor(appEnv: AppEnv, timeout: number | undefined) {
    this.appEnv = appEnv
    const db = getMain(this.appEnv.mainDB)
    this.nodeModel = new NodeModel(db)
    this.workerModel = new WorkerModel(db)
    if (timeout) {
      this.timeout = timeout
    }
  }

  public start() {
    if (this.interval) {
      return
    }
    this.interval = setInterval(() => this._start(), this.timeout)
    log.debug('StatusMonitoring start')
  }

  public stop() {
    if (!this.interval) {
      return
    }
    clearInterval(this.interval)
    this.interval = null
    log.debug('StatusMonitoring stop')
  }

  private async _start() {
    if (this.isStart) {
      return
    }
    this.isStart = true
    const nodes = this.nodeModel.getAll()
    for (const nodeModel of nodes) {
      try {
        let data = {}

        const node =
          nodeModel.type === NodeType.local
            ? new LocalNode(nodeModel, this.appEnv)
            : new LocalNode(nodeModel, this.appEnv)
        const peers = await node.getPeers()
        const sync = await node.getSync()

        if (peers) {
          data = {
            ...data,
            ...peers
          }
        }
        if (sync) {
          data = {
            ...data,
            ...sync,
            coordinatorStatus:
              sync.coordinatorSyncDistance && sync.coordinatorSyncDistance > 10
                ? CoordinatorStatus.syncing
                : CoordinatorStatus.running,
            validatorStatus:
              sync.validatorSyncDistance && sync.validatorSyncDistance > 50
                ? ValidatorStatus.syncing
                : ValidatorStatus.running
          }
        }
        if (Object.keys(data).length > 0) this.nodeModel.update(nodeModel.id, data)

        if (
          sync?.coordinatorFinalizedEpoch &&
          nodeModel.coordinatorFinalizedEpoch.toString() !==
            sync.coordinatorFinalizedEpoch.toString()
        ) {
          const workers = this.workerModel.getByNodeId(nodeModel.id)
          for (const workerModel of workers) {
            try {
              const workerStatus = await node.getWorkerStatus(workerModel)
              // console.log('workerStatus', workerStatus)
              if (!areObjectsEqual(workerStatus, workerModel))
                this.workerModel.update(workerModel.id, workerStatus)
            } catch (error) {
              log.error(error)
            }
          }
        }
      } catch (error) {
        log.error(error)
      }
    }

    this.isStart = false
  }
}

const appEnv = new AppEnv({
  isPackaged: workerData.isPackaged,
  appPath: workerData.appPath,
  userData: workerData.userData,
  version: workerData.version
})
log.debug({
  isPackaged: workerData.isPackaged,
  appPath: workerData.appPath,
  userData: workerData.userData,
  version: workerData.version
})

const monitoring = new StatusMonitoring(appEnv, 4000)

parentPort?.on('message', (message: ParentMessage) => {
  if (message.type === 'start') {
    monitoring.start()
  } else if (message.type === 'stop') {
    monitoring.stop()
  }
})

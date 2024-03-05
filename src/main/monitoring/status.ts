import { parentPort, workerData } from 'worker_threads'
import log from 'electron-log/node'
import { getMain } from '../libs/db'
import AppEnv from '../libs/appEnv'
import NodeModel, { Type as NodeType } from '../models/node'
import LocalNode from '../node/local'

const port = parentPort
if (!port) throw new Error('IllegalState')

interface ParentMessage {
  type: 'start' | 'stop'
}

class StatusMonitoring {
  private timeout: number = 4000
  private appEnv: AppEnv
  private nodeModel: NodeModel
  private interval: NodeJS.Timeout | null = null
  private isStart = false

  constructor(appEnv, timeout: number | undefined) {
    this.appEnv = appEnv
    console.log(this.appEnv.mainDB)
    const db = getMain(this.appEnv.mainDB)
    this.nodeModel = new NodeModel(db)
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
    console.log('_start')
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
            ...sync
          }
        }
        if (Object.keys(data).length > 0) this.nodeModel.update(nodeModel.id, data)
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
  userData: workerData.userData
})

const monitoring = new StatusMonitoring(appEnv, 4000)

parentPort?.on('message', (message: ParentMessage) => {
  if (message.type === 'start') {
    monitoring.start()
  } else if (message.type === 'stop') {
    monitoring.stop()
  }
})

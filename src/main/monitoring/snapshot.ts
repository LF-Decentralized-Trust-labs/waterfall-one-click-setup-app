import { parentPort, workerData } from 'worker_threads'
import log from 'electron-log/node'
import { getMain } from '../libs/db'
import AppEnv from '../libs/appEnv'
import NodeModel, { DownloadStatus } from '../models/node'
import LocalNode from '../node/local'
import { delay } from '../helpers/common'

const port = parentPort
if (!port) throw new Error('IllegalState')

interface ParentMessage {
  type: 'start' | 'stop'
}

class SnapshotMonitoring {
  private timeout: number = 4000
  private appEnv: AppEnv
  private nodeModel: NodeModel
  private interval: NodeJS.Timeout | null = null
  private isStart = false
  private nodes: {
    [key: string]: LocalNode
  }

  constructor(appEnv: AppEnv, timeout: number | undefined) {
    this.appEnv = appEnv
    const db = getMain(this.appEnv.mainDB)
    this.nodeModel = new NodeModel(db)
    this.nodes = {}
    if (timeout) {
      this.timeout = timeout
    }
  }

  public start() {
    if (this.interval) {
      return
    }
    this.interval = setInterval(() => this._start(), this.timeout)
    log.debug('SnapshotMonitoring start')
  }

  public async stop() {
    if (!this.interval) {
      return
    }
    clearInterval(this.interval)
    this.interval = null
    while (this.isStart) {
      await delay(100)
    }
    for (const node of Object.values(this.nodes)) {
      node.stopDownload()
    }
    log.debug('SnapshotMonitoring stop')
  }

  private async _start() {
    if (this.isStart) {
      return
    }
    this.isStart = true
    const nodes = this.nodeModel.getAll()
    for (const nodeModel of nodes) {
      try {
        if (
          this.nodes[nodeModel.id.toString()] &&
          nodeModel.downloadStatus === DownloadStatus.finish
        ) {
          this.nodes[nodeModel.id.toString()].removeAllListeners()
          delete this.nodes[nodeModel.id.toString()]
          continue
        }
        if (!this.nodes[nodeModel.id.toString()]) {
          this.nodes[nodeModel.id.toString()] = new LocalNode(nodeModel, this.appEnv)
          this.nodes[nodeModel.id.toString()].on('finishDownload', () => {
            log.debug('finishDownload', nodeModel.id)
            this.nodeModel.update(nodeModel.id, {
              downloadStatus: DownloadStatus.verifying
            })
            this.nodes[nodeModel.id.toString()].removeAllListeners()
            delete this.nodes[nodeModel.id.toString()]
          })
          this.nodes[nodeModel.id.toString()].on('finishVerified', (result) => {
            log.debug('finishVerified', nodeModel.id, result)
            this.nodeModel.update(nodeModel.id, {
              downloadStatus: result ? DownloadStatus.extracting : DownloadStatus.downloading
            })
            this.nodes[nodeModel.id.toString()].removeAllListeners()
            delete this.nodes[nodeModel.id.toString()]
          })
          this.nodes[nodeModel.id.toString()].on('finishExtracted', () => {
            log.debug('finishExtracted', nodeModel.id)
            this.nodeModel.update(nodeModel.id, {
              downloadStatus: DownloadStatus.finish
            })
            this.nodes[nodeModel.id.toString()].removeAllListeners()
            delete this.nodes[nodeModel.id.toString()]
            port!.postMessage({ type: 'finish', id: nodeModel.id })
          })
          let percent = 0
          this.nodes[nodeModel.id.toString()].on('progressDownload', (bytes) => {
            const newPercent = Math.floor((bytes / nodeModel.downloadSize) * 100)
            if (percent !== newPercent) {
              percent = newPercent
              log.debug(
                'progressDownload',
                nodeModel.id,
                percent,
                `${bytes}/${nodeModel.downloadSize}`
              )
            }
            this.nodeModel.update(nodeModel.id, {
              downloadBytes: bytes
            })
          })
          this.nodes[nodeModel.id.toString()].on('error', (error) => {
            log.error('error', nodeModel.id, error)
            this.nodes[nodeModel.id.toString()].removeAllListeners()
            delete this.nodes[nodeModel.id.toString()]
          })
          this.nodes[nodeModel.id.toString()].on('stopped', () => {
            log.error('stopped', nodeModel.id)
            this.nodes[nodeModel.id.toString()].removeAllListeners()
            delete this.nodes[nodeModel.id.toString()]
          })
        }
        await this.nodes[nodeModel.id.toString()].downloadSnapshot()
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

const monitoring = new SnapshotMonitoring(appEnv, 10000)

port?.on('message', async (message: ParentMessage) => {
  if (message.type === 'start') {
    monitoring.start()
  } else if (message.type === 'stop') {
    await monitoring.stop()
  }
})

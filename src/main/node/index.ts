import { IpcMain, IpcMainInvokeEvent } from 'electron'
import log from 'electron-log/node'
import { getMain } from '../libs/db'
import AppEnv from '../libs/appEnv'
import LocalNode, { StatusResult, StatusResults } from './local'
import NodeModel, {
  Node as NodeModelType,
  NewNode,
  Type as NodeType,
  CoordinatorStatus,
  ValidatorStatus,
  CoordinatorValidatorStatus,
  DownloadStatus
} from '../models/node'
import WorkerModel from '../models/worker'
import { checkPort } from '../libs/fs'

enum ErrorResults {
  NODE_NOT_FOUND = 'Node Not Found',
  NODE_NOT_CREATED = 'Node Not Created'
}

class Node {
  private ipcMain: IpcMain
  private appEnv: AppEnv
  private nodeModel: NodeModel
  private workerModel: WorkerModel

  private nodes: {
    [key: string]: LocalNode
  }

  constructor(ipcMain: IpcMain, appEnv: AppEnv) {
    this.ipcMain = ipcMain
    this.appEnv = appEnv
    this.nodes = {}
    this.nodeModel = new NodeModel(getMain(this.appEnv.mainDB))
    this.workerModel = new WorkerModel(getMain(this.appEnv.mainDB))
  }

  public async initialize(): Promise<boolean> {
    this.ipcMain.handle('node:start', (_event: IpcMainInvokeEvent, id) => this.start(id))
    this.ipcMain.handle('node:stop', (_event: IpcMainInvokeEvent, id) => this._stop(id))
    this.ipcMain.handle('node:restart', (_event: IpcMainInvokeEvent, id) => this._restart(id))
    this.ipcMain.handle('node:getAll', () => this.nodeModel.getAll())
    this.ipcMain.handle('node:getById', (_event: IpcMainInvokeEvent, id) =>
      this.nodeModel.getById(id)
    )
    this.ipcMain.handle('node:add', (_event: IpcMainInvokeEvent, options: NewNode) =>
      this._add(options)
    )
    this.ipcMain.handle('node:delete', (_event: IpcMainInvokeEvent, ids, withData) =>
      this._delete(ids, withData)
    )
    this.ipcMain.handle('node:checkPorts', (_event: IpcMainInvokeEvent, ports) =>
      this._checkPorts(ports)
    )

    const nodeModels = this.nodeModel.getAll()

    let status = true
    for (const _nodeModel of nodeModels) {
      const statusAdd = await this._addNode(_nodeModel)
      if (!statusAdd && status) {
        status = false
      }
    }

    return status
  }
  public async destroy() {
    this.ipcMain.removeHandler('node:start')
    this.ipcMain.removeHandler('node:stop')
    this.ipcMain.removeHandler('node:restart')
    this.ipcMain.removeHandler('node:getAll')
    this.ipcMain.removeHandler('node:getById')
    this.ipcMain.removeHandler('node:add')
    this.ipcMain.removeHandler('node:delete')
    this.ipcMain.removeHandler('node:checkPorts')

    for (const id of Object.keys(this.nodes)) {
      await this.nodes[id].stop()
    }
  }

  public async start(id: number): Promise<StatusResults | ErrorResults> {
    if (!this.nodes[id.toString()]) {
      const nodeModel = this.nodeModel.getById(id)
      if (!nodeModel || nodeModel.downloadStatus !== DownloadStatus.finish) {
        return ErrorResults.NODE_NOT_FOUND
      }
      await this._addNode(nodeModel)
    }
    return this.nodes[id.toString()].start()
  }

  private async _stop(id: number): Promise<StatusResults | ErrorResults> {
    if (!this.nodes[id.toString()]) {
      const nodeModel = this.nodeModel.getById(id)
      if (!nodeModel || nodeModel.downloadStatus !== DownloadStatus.finish) {
        return ErrorResults.NODE_NOT_FOUND
      }
      await this._addNode(nodeModel)
    }
    return this.nodes[id.toString()].stop()
  }

  private async _restart(id: number): Promise<StatusResults | ErrorResults> {
    if (!this.nodes[id.toString()]) {
      const nodeModel = this.nodeModel.getById(id)
      if (!nodeModel || nodeModel.downloadStatus !== DownloadStatus.finish) {
        return ErrorResults.NODE_NOT_FOUND
      }
      await this._addNode(nodeModel)
    }
    return this.nodes[id.toString()].restart()
  }

  private async _add(options: NewNode): Promise<NodeModelType | ErrorResults> {
    const nodeModel = this.nodeModel.insert(options)
    if (!nodeModel) {
      return ErrorResults.NODE_NOT_CREATED
    }
    const result = await this._addNode(nodeModel)
    if (result) {
      return nodeModel
    }
    return ErrorResults.NODE_NOT_CREATED
  }

  private async _addNode(nodeModel: NodeModelType) {
    if (nodeModel === null) return false
    if (nodeModel.downloadStatus !== DownloadStatus.finish) return true
    if (!this.nodes[nodeModel.id.toString()]) {
      this.nodes[nodeModel.id.toString()] =
        nodeModel.type === NodeType.local
          ? new LocalNode(nodeModel, this.appEnv)
          : new LocalNode(nodeModel, this.appEnv)
    }
    const node = this.nodes[nodeModel.id.toString()]
    const initNodeStatus = await node.initialize()
    log.debug('initNodeStatus', initNodeStatus)
    node.on('stop', () => {
      const pids = node.getPids()
      this.nodeModel.update(nodeModel.id, {
        coordinatorPid: pids.coordinatorBeacon,
        coordinatorStatus: pids.coordinatorBeacon
          ? CoordinatorStatus.running
          : CoordinatorStatus.stopped,
        coordinatorPeersCount: 0,
        validatorPid: pids.validator,
        validatorStatus: pids.validator ? ValidatorStatus.running : ValidatorStatus.stopped,
        validatorPeersCount: 0,
        coordinatorValidatorPid: pids.coordinatorValidator,
        coordinatorValidatorStatus: pids.coordinatorValidator
          ? CoordinatorValidatorStatus.running
          : CoordinatorValidatorStatus.stopped
      })
    })
    if (
      initNodeStatus.coordinatorBeacon === StatusResult.success &&
      initNodeStatus.validator === StatusResult.success &&
      initNodeStatus.coordinatorValidator === StatusResult.success
    ) {
      await node.start()
      const pids = node.getPids()
      this.nodeModel.update(nodeModel.id, {
        coordinatorPid: pids.coordinatorBeacon,
        coordinatorStatus: pids.coordinatorBeacon
          ? CoordinatorStatus.running
          : CoordinatorStatus.stopped,
        validatorPid: pids.validator,
        validatorStatus: pids.validator ? ValidatorStatus.running : ValidatorStatus.stopped,
        coordinatorValidatorPid: pids.coordinatorValidator,
        coordinatorValidatorStatus: pids.coordinatorValidator
          ? CoordinatorValidatorStatus.running
          : CoordinatorValidatorStatus.stopped
      })
      return true
    }
    return false
  }

  private async _delete(
    ids: number[] | bigint[],
    withData = false
  ): Promise<boolean[] | ErrorResults> {
    log.debug('_delete', ids, withData)
    if (!ids || ids.length == 0) {
      return ErrorResults.NODE_NOT_FOUND
    }

    const results = ids.map(() => false)

    for (const id of ids) {
      const nodeModel = this.nodeModel.getById(id)
      if (!nodeModel) {
        continue
      }
      if (
        nodeModel.coordinatorStatus !== CoordinatorStatus.stopped ||
        nodeModel.validatorStatus !== ValidatorStatus.stopped ||
        nodeModel.coordinatorValidatorStatus !== CoordinatorValidatorStatus.stopped
      ) {
        continue
      }
      const countWorkers = this.workerModel.getCount({ nodeId: id })
      if (countWorkers && countWorkers > 0) {
        continue
      }

      const node =
        nodeModel.type === NodeType.local
          ? new LocalNode(nodeModel, this.appEnv)
          : new LocalNode(nodeModel, this.appEnv)

      if (withData) {
        if (!(await node.removeData())) {
          continue
        }
      }

      const status = this.nodeModel.remove(id)
      const index = ids.findIndex((id) => id === nodeModel.id)
      results[index] = status
    }

    return results
  }

  private async _checkPorts(ports: number[]) {
    return await Promise.all(ports.map((port) => checkPort(port)))
  }
}

export default Node

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
  CoordinatorValidatorStatus
} from '../models/node'

enum ErrorResults {
  NODE_NOT_FOUND = 'Node Not Found',
  NODE_NOT_CREATED = 'Node Not Created'
}

class Node {
  private ipcMain: IpcMain
  private appEnv: AppEnv
  private nodeModel: NodeModel

  private nodes: {
    [key: string]: LocalNode
  }

  constructor(ipcMain: IpcMain, appEnv: AppEnv) {
    this.ipcMain = ipcMain
    this.appEnv = appEnv
    this.nodes = {}
    this.nodeModel = new NodeModel(getMain(this.appEnv.mainDB))
    console.log(`Node constructor`)
  }

  public async initialize(): Promise<boolean> {
    this.ipcMain.handle('node:start', (_event: IpcMainInvokeEvent, id) => this._start(id))
    this.ipcMain.handle('node:stop', (_event: IpcMainInvokeEvent, id) => this._stop(id))
    this.ipcMain.handle('node:restart', (_event: IpcMainInvokeEvent, id) => this._restart(id))
    this.ipcMain.handle('node:getAll', () => this.nodeModel.getAll())
    this.ipcMain.handle('node:getById', (_event: IpcMainInvokeEvent, id) =>
      this.nodeModel.getById(id)
    )
    this.ipcMain.handle('node:add', (_event: IpcMainInvokeEvent, options: NewNode) =>
      this._add(options)
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

    for (const id of Object.keys(this.nodes)) {
      await this.nodes[id].stop()
    }
  }

  private async _start(id: number): Promise<StatusResults | ErrorResults> {
    console.log('_start', id, this.nodes)
    if (!this.nodes[id.toString()]) return ErrorResults.NODE_NOT_FOUND
    return this.nodes[id.toString()].start()
  }

  private async _stop(id: number): Promise<StatusResults | ErrorResults> {
    if (!this.nodes[id.toString()]) return ErrorResults.NODE_NOT_FOUND
    return this.nodes[id.toString()].stop()
  }

  private async _restart(id: number): Promise<StatusResults | ErrorResults> {
    if (!this.nodes[id.toString()]) return ErrorResults.NODE_NOT_FOUND
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
      // await node.start()
      // const pids = node.getPids()
      // this.nodeModel.update(nodeModel.id, {
      //   coordinatorPid: pids.coordinatorBeacon,
      //   coordinatorStatus: pids.coordinatorBeacon
      //     ? CoordinatorStatus.running
      //     : CoordinatorStatus.stopped,
      //   validatorPid: pids.validator,
      //   validatorStatus: pids.validator ? ValidatorStatus.running : ValidatorStatus.stopped,
      //   coordinatorValidatorPid: pids.coordinatorValidator,
      //   coordinatorValidatorStatus: pids.coordinatorValidator
      //     ? CoordinatorValidatorStatus.running
      //     : CoordinatorValidatorStatus.stopped
      // })
      return true
    }
    return false
  }
}

export default Node

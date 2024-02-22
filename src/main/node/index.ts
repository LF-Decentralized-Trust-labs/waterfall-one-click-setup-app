import { IpcMain, IpcMainInvokeEvent } from 'electron'
import LocalNode, { StatusResult, StatusResults } from './local'
import { getAll, insert as nodeInsert, NewNode, Type, Type as NodeType } from '../models/node'
import { Network } from '../libs/env'

enum ErrorResults {
  NODE_NOT_FOUND = 'Node Not Found',
  NODE_NOT_CREATED = 'Node Not Created'
}

class Node {
  private ipcMain: IpcMain

  private nodes: {
    [key: string]: LocalNode
  }

  constructor(ipcMain: IpcMain) {
    this.ipcMain = ipcMain
    this.nodes = {}
    console.log(`Node constructor`)
  }
  public async initialize(): Promise<boolean> {
    this.ipcMain.handle('node:start', (_event: IpcMainInvokeEvent, id) => this._start(id))
    this.ipcMain.handle('node:stop', (_event: IpcMainInvokeEvent, id) => this._stop(id))
    this.ipcMain.handle('node:restart', (_event: IpcMainInvokeEvent, id) => this._restart(id))
    this.ipcMain.handle('node:getAll', () => getAll())
    this.ipcMain.handle('node:add', (_event: IpcMainInvokeEvent, options: NewNode) =>
      this._add(options)
    )

    const nodeModels = getAll()
    console.log('nodeModels', nodeModels)
    let status = true
    for (const nodeModel of nodeModels) {
      if (!this.nodes[nodeModel.id.toString()]) {
        this.nodes[nodeModel.id.toString()] =
          nodeModel.type === NodeType.local ? new LocalNode(nodeModel) : new LocalNode(nodeModel)
      }
      const node = this.nodes[nodeModel.id.toString()]
      const initNodeStatus = await node.initialize()
      console.log('initNodeStatus', initNodeStatus)
      if (
        status &&
        (initNodeStatus.coordinatorBeacon === StatusResult.fail ||
          initNodeStatus.validator === StatusResult.fail ||
          initNodeStatus.coordinatorValidator === StatusResult.fail)
      )
        status = false
    }

    return status
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
  private async _add(options: NewNode): Promise<StatusResults | ErrorResults> {
    const nodeModel = nodeInsert(options)
    if (!nodeModel) {
      return ErrorResults.NODE_NOT_CREATED
    }
    const node =
      nodeModel.type === NodeType.local ? new LocalNode(nodeModel) : new LocalNode(nodeModel)
    this.nodes[nodeModel.id.toString()] = node

    return await node.initialize()
  }
  public async tmp(): Promise<StatusResults | ErrorResults> {
    return await this._add({
      name: 'node1',
      network: Network.testnet8,
      type: Type.local,
      locationDir: '/Users/alex/Downloads/wf-test'
    })
  }
}

export default Node

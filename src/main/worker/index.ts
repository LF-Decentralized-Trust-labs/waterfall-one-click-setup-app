import { IpcMain, IpcMainInvokeEvent } from 'electron'
import log from 'electron-log/node'
import AppEnv from '../libs/appEnv'
import NodeModel, { CoordinatorStatus, Type as NodeType, ValidatorStatus } from '../models/node'
import WorkerModel, {
  NewWorker as NewWorkerModelType,
  Worker as WorkerModelType
} from '../models/worker'
import { getMain } from '../libs/db'
import Web3 from 'web3'
import {
  GetDepositDataResponse,
  GetCoordinatorKeyStoreResponseType,
  GetValidatorKeyStoreResponseType
} from 'web3/utils'
import LocalNode from '../node/local'
import crypto from 'crypto'
import { getStakeAmount } from '../libs/env'

enum ErrorResults {
  NODE_NOT_FOUND = 'Node is Not Found',
  MNEMONIC_NOT_PROVIDED = 'Mnemonic is not provided',
  MNEMONIC_NOT_MATCHED = 'Mnemonic is not matched',
  MNEMONIC_INVALID = 'Invalid mnemonic',
  AMOUNT_NOT_PROVIDED = 'Amount is not provided',
  WITHDRAWAL_NOT_PROVIDED = 'Withdrawal Address is not provided',
  WORKER_NOT_FOUND = 'Worker Is Not Found',
  ACTION_NOT_FOUND = 'Action is not provided',
  PASSWORD_NOT_GENERATE = 'Password was not generated',
  ADD_WORKER_FAILED = 'Add Worker Failed'
}

export interface Response<T> {
  status: 'error' | 'success'
  message?: ErrorResults
  data?: T
}
export interface Key {
  depositData: GetDepositDataResponse
  coordinatorKey: GetCoordinatorKeyStoreResponseType
  validatorKey: GetValidatorKeyStoreResponseType
  coordinatorPassword: string
  validatorPassword: string
}

export interface PublicKey {
  id: number | bigint
  coordinatorPublicKey: string
  validatorAddress: string
}

export interface addParams {
  nodeId: number | bigint
  mnemonic: string
  amount: number
  withdrawalAddress: string
}

export enum ActionTxType {
  activate = 'activate',
  deActivate = 'deActivate',
  withdraw = 'withdraw'
}
export interface ActionTx {
  from: string
  to: string
  value: number | bigint
  hexData: string
}

class Worker {
  private ipcMain: IpcMain
  private appEnv: AppEnv
  private nodeModel: NodeModel
  private workerModel: WorkerModel

  constructor(ipcMain: IpcMain, appEnv: AppEnv) {
    this.ipcMain = ipcMain
    this.appEnv = appEnv
    this.nodeModel = new NodeModel(getMain(this.appEnv.mainDB))
    this.workerModel = new WorkerModel(getMain(this.appEnv.mainDB))
  }

  public async initialize(): Promise<boolean> {
    this.ipcMain.handle('worker:genMnemonic', () => this._genMnemonic())
    this.ipcMain.handle('worker:add', (_event: IpcMainInvokeEvent, data) => this._add(data))
    this.ipcMain.handle('worker:delete', (_event: IpcMainInvokeEvent, ids) => this._delete(ids))
    this.ipcMain.handle('worker:getAll', () => this.workerModel.getAll({ withNode: true }))
    this.ipcMain.handle('worker:getById', (_event: IpcMainInvokeEvent, id) =>
      this.workerModel.getById(id, { withNode: true })
    )
    this.ipcMain.handle('worker:getAllByNodeId', (_event: IpcMainInvokeEvent, id) =>
      this.workerModel.getByNodeId(id, { withNode: true })
    )
    this.ipcMain.handle('worker:getActionTx', (_event: IpcMainInvokeEvent, action, id, amount) =>
      this._getActionTx(action, id, amount)
    )

    return true
  }

  public async destroy() {
    this.ipcMain.removeHandler('worker:genMnemonic')
    this.ipcMain.removeHandler('worker:add')
    this.ipcMain.removeHandler('worker:delete')
    this.ipcMain.removeHandler('worker:getAll')
    this.ipcMain.removeHandler('worker:getById')
    this.ipcMain.removeHandler('worker:getAllByNodeId')
    this.ipcMain.removeHandler('worker:getActionTx')
  }

  private _genMnemonic() {
    return Web3.utils.genMnemonic()
  }

  private async _add(data: addParams): Promise<Response<WorkerModelType[]>> {
    if (!data.nodeId) {
      return {
        status: 'error',
        message: ErrorResults.NODE_NOT_FOUND
      }
    }
    if (!data.mnemonic) {
      return {
        status: 'error',
        message: ErrorResults.MNEMONIC_NOT_PROVIDED
      }
    }
    const memoHash = Web3.utils.sha3(data.mnemonic)
    if (!memoHash) {
      return { status: 'error', message: ErrorResults.MNEMONIC_NOT_PROVIDED }
    }
    if (!data.amount) {
      return { status: 'error', message: ErrorResults.AMOUNT_NOT_PROVIDED }
    }
    if (!data.withdrawalAddress) {
      return { status: 'error', message: ErrorResults.WITHDRAWAL_NOT_PROVIDED }
    }
    const nodeModel = this.nodeModel.getById(data.nodeId)
    if (!nodeModel) {
      return { status: 'error', message: ErrorResults.NODE_NOT_FOUND }
    }
    if (nodeModel.memoHash && nodeModel.memoHash !== memoHash) {
      return { status: 'error', message: ErrorResults.MNEMONIC_NOT_MATCHED }
    }

    const node =
      nodeModel.type === NodeType.local
        ? new LocalNode(nodeModel, this.appEnv)
        : new LocalNode(nodeModel, this.appEnv)

    const coordinatorPassword = await node.getCoordinatorValidatorPassword()
    if (!coordinatorPassword) {
      return { status: 'error', message: ErrorResults.PASSWORD_NOT_GENERATE }
    }

    log.debug('workersCount', nodeModel.workersCount)
    const firstIndex = nodeModel.workersCount ? nodeModel.workersCount : 0
    const lastIndex = nodeModel.workersCount ? nodeModel.workersCount + data.amount : data.amount
    const keys: Key[] = []
    const newWorkers: NewWorkerModelType[] = []
    for (let index = firstIndex; index < lastIndex; index++) {
      try {
        const validatorPassword = crypto.randomBytes(16).toString('hex')
        const key = {
          depositData: await Web3.utils.getDepositData(
            data.mnemonic,
            index,
            data.withdrawalAddress
          ),
          coordinatorKey: await Web3.utils.getCoordinatorKeyStore(
            data.mnemonic,
            index,
            coordinatorPassword
          ),
          validatorKey: await Web3.utils.getValidatorKeyStore(
            data.mnemonic,
            index,
            validatorPassword
          ),
          validatorPassword,
          coordinatorPassword
        }
        const worker: NewWorkerModelType = {
          nodeId: data.nodeId,
          coordinatorPublicKey: key.depositData.pubkey,
          validatorAddress: key.depositData.creator_address,
          withdrawalAddress: key.depositData.withdrawal_address,
          signature: key.depositData.signature
        }
        keys.push(key)
        newWorkers.push(worker)
      } catch (error) {
        log.error(error)
        if (error instanceof Error && error.message.includes('invalid mnemonic')) {
          return { status: 'error', message: ErrorResults.MNEMONIC_INVALID }
        }
        return { status: 'error', message: ErrorResults.ADD_WORKER_FAILED }
      }
    }

    if (memoHash && !nodeModel.memoHash) {
      nodeModel.memoHash = memoHash
    }
    const workers = this.workerModel.insert(newWorkers, nodeModel)

    await node.addWorkers(keys, lastIndex)

    return { status: 'success', data: workers }
  }
  private async _delete(ids: number[] | bigint[]): Promise<boolean[] | ErrorResults> {
    log.debug('_delete', ids)
    if (!ids || ids.length == 0) {
      return ErrorResults.WORKER_NOT_FOUND
    }
    const results = ids.map(() => false)

    const nodes = {}

    for (const id of ids) {
      const worker = this.workerModel.getById(id)
      if (!worker) {
        return ErrorResults.WORKER_NOT_FOUND
      }
      if (!nodes[worker.nodeId.toString()]) {
        nodes[worker.nodeId.toString()] = []
      }
      nodes[worker.nodeId.toString()].push(worker)
    }

    for (const nodeId in nodes) {
      const nodeWorker = nodes[nodeId]
      const nodeModel = this.nodeModel.getById(parseInt(nodeId))
      if (
        !nodeModel ||
        nodeModel.coordinatorStatus !== CoordinatorStatus.stopped ||
        nodeModel.validatorStatus !== ValidatorStatus.stopped
      ) {
        continue
      }
      const node =
        nodeModel.type === NodeType.local
          ? new LocalNode(nodeModel, this.appEnv)
          : new LocalNode(nodeModel, this.appEnv)

      const countByNode = this.workerModel.getCount({ nodeId: parseInt(nodeId) })

      const keys = nodeWorker.map((worker) => ({
        id: worker.id,
        coordinatorPublicKey: worker.coordinatorPublicKey,
        validatorAddress: worker.validatorAddress
      }))

      const isAll = countByNode === nodeWorker.length
      log.debug('countByNode', isAll, countByNode, nodeWorker.length)
      const statuses = await node.removeWorkers(keys, isAll)
      log.debug('removeWorkers', statuses)
      if (isAll) {
        this.nodeModel.update(nodeModel.id, { memoHash: '', workersCount: 0 })
      }

      for (const workerStatus of statuses) {
        if (!workerStatus.status) {
          continue
        }
        const status = this.workerModel.remove(workerStatus.id)
        if (status) {
          const index = ids.findIndex((id) => id === workerStatus.id)
          results[index] = true
        }
      }
    }
    return results
  }
  private async _getActionTx(
    action: ActionTxType,
    id: number,
    amount?: string
  ): Promise<ActionTx | ErrorResults> {
    if (!action) {
      return ErrorResults.ACTION_NOT_FOUND
    }
    if (action === ActionTxType.withdraw && !amount) {
      return ErrorResults.AMOUNT_NOT_PROVIDED
    }
    const worker = this.workerModel.getById(id, { withNode: true })
    if (!worker) {
      return ErrorResults.WORKER_NOT_FOUND
    }
    if (!worker.node) {
      return ErrorResults.NODE_NOT_FOUND
    }

    const node =
      worker.node.type === NodeType.local
        ? new LocalNode(worker.node, this.appEnv)
        : new LocalNode(worker.node, this.appEnv)

    let hexData, value
    if (action === ActionTxType.activate) {
      hexData = await node.runValidatorCommand(
        `wat.validator.depositData({pubkey:'0x${worker.coordinatorPublicKey}', creator_address:'0x${worker.validatorAddress}', withdrawal_address:'0x${worker.withdrawalAddress}', signature:'0x${worker.signature}'})`
      )
      value = getStakeAmount(worker.node.network)
    } else if (action === ActionTxType.deActivate) {
      hexData = await node.runValidatorCommand(
        `wat.validator.exitData({pubkey:'0x${worker.coordinatorPublicKey}' , creator_address:'0x${worker.validatorAddress}'})`
      )
      value = 0
    } else if (action === ActionTxType.withdraw) {
      value = 0
      hexData = await node.runValidatorCommand(
        `wat.validator.withdrawalData({creator_address:'0x${worker.validatorAddress}', amount:web3.toWei('${amount}', 'ether')})`
      )
    }

    return {
      hexData,
      value,
      to: (await node.runValidatorCommand('wat.validator.depositAddress()')) as string,
      from: `0x${worker.withdrawalAddress}`
    }
  }
}

export default Worker

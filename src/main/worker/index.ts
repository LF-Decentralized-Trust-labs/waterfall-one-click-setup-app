import { IpcMain, IpcMainInvokeEvent } from 'electron'
import AppEnv from '../libs/appEnv'
import NodeModel, { Type as NodeType } from '../models/node'
import WorkerModel, {
  NewWorker as NewWorkerModelType,
  Worker as WorkerModelType,
  WorkerStatus
} from '../models/worker'
import { getMain } from '../libs/db'
import Web3 from 'web3'
import {
  GetValidatorsKeysResponseType,
  GetDepositDataResponse,
  GetKeyStoreResponseType
} from 'web3/utils'
import LocalNode from '../node/local'
import crypto from 'crypto'

enum ErrorResults {
  NODE_NOT_FOUND = 'Node is Not Found',
  MNEMONIC_NOT_PROVIDED = 'Mnemonic is not provided',
  MNEMONIC_NOT_MATCHED = 'Mnemonic is not matched',
  AMOUNT_NOT_PROVIDED = 'Amount is not provided',
  WITHDRAWAL_NOT_PROVIDED = 'Withdrawal Address is not provided',
  WORKER_NOT_FOUND = 'Worker Is Not Found',
  ACTION_NOT_FOUND = 'Action is not provided',
  PASSWORD_NOT_GENERATE = 'Password was not generated'
}

export interface Key {
  depositData: GetDepositDataResponse
  coordinatorKey: GetKeyStoreResponseType
  validatorKey: GetValidatorsKeysResponseType
  coordinatorPassword: string
  validatorPassword: string
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
    console.log(`Worker constructor`)
  }

  public async initialize(): Promise<boolean> {
    this.ipcMain.handle('worker:genMnemonic', () => this._genMnemonic())
    this.ipcMain.handle('worker:add', (_event: IpcMainInvokeEvent, data) => this._add(data))
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
    this.ipcMain.removeHandler('worker:getAll')
    this.ipcMain.removeHandler('worker:getById')
    this.ipcMain.removeHandler('worker:getAllByNodeId')
    this.ipcMain.removeHandler('worker:getActionTx')
  }

  public async getStatus(worker: WorkerModelType) {
    if (!worker) {
      return ErrorResults.WORKER_NOT_FOUND
    }
    if (!worker.node) {
      return ErrorResults.NODE_NOT_FOUND
    }
    const results: WorkerStatus = {
      coordinatorStatus: worker.coordinatorStatus,
      coordinatorBalanceAmount: worker.coordinatorBalanceAmount,
      coordinatorActivationEpoch: worker.coordinatorActivationEpoch,
      coordinatorDeActivationEpoch: worker.coordinatorDeActivationEpoch,
      validatorStatus: worker.validatorStatus,
      validatorBalanceAmount: worker.validatorBalanceAmount,
      validatorActivationEpoch: worker.validatorActivationEpoch,
      validatorDeActivationEpoch: worker.validatorDeActivationEpoch,
      stakeAmount: worker.stakeAmount
    }

    const node =
      worker.node.type === NodeType.local
        ? new LocalNode(worker.node, this.appEnv)
        : new LocalNode(worker.node, this.appEnv)

    const coordinatorResponse = await node.runCoordinatorCommand(
      `/eth/v1/beacon/states/head/validators/0x${worker.coordinatorPublicKey}`
    )

    if (coordinatorResponse?.data) {
      results.coordinatorStatus = coordinatorResponse.data.status
      results.coordinatorBalanceAmount = coordinatorResponse.data.balance
      results.coordinatorActivationEpoch = coordinatorResponse.data.validator.activation_epoch
      results.coordinatorDeActivationEpoch = coordinatorResponse.data.validator.exit_epoch
      results.stakeAmount = coordinatorResponse.data.validator.effective_balance
    }
    const validatorResponse = await node.runValidatorCommand(
      `wat.validator.getInfo("0x${worker.validatorAddress}")`
    )

    console.log(validatorResponse)

    return results
  }
  private _genMnemonic() {
    return Web3.utils.genMnemonic()
  }

  private async _add(data: addParams): Promise<WorkerModelType[] | ErrorResults> {
    if (!data.nodeId) {
      return ErrorResults.NODE_NOT_FOUND
    }
    if (!data.mnemonic) {
      return ErrorResults.MNEMONIC_NOT_PROVIDED
    }
    const memoHash = Web3.utils.sha3(data.mnemonic)
    if (!memoHash) {
      return ErrorResults.MNEMONIC_NOT_PROVIDED
    }
    if (!data.amount) {
      return ErrorResults.AMOUNT_NOT_PROVIDED
    }
    if (!data.withdrawalAddress) {
      return ErrorResults.WITHDRAWAL_NOT_PROVIDED
    }
    const nodeModel = this.nodeModel.getById(data.nodeId)
    if (!nodeModel) {
      return ErrorResults.NODE_NOT_FOUND
    }
    if (nodeModel.memoHash && nodeModel.memoHash !== memoHash) {
      return ErrorResults.MNEMONIC_NOT_MATCHED
    }

    const node =
      nodeModel.type === NodeType.local
        ? new LocalNode(nodeModel, this.appEnv)
        : new LocalNode(nodeModel, this.appEnv)

    const coordinatorPassword = await node.getCoordinatorValidatorPassword()
    if (!coordinatorPassword) {
      return ErrorResults.PASSWORD_NOT_GENERATE
    }

    const lastWorker = this.workerModel.getByNodeIdLast(nodeModel.id)

    let index = lastWorker ? lastWorker.number + 1 : 0
    const lastIndex = lastWorker ? lastWorker.number + data.amount : data.amount
    const keys: Key[] = []
    const newWorkers: NewWorkerModelType[] = []
    for (index; index < lastIndex; index++) {
      const validatorPassword = crypto.randomBytes(16).toString('hex')
      const key = {
        depositData: await Web3.utils.getDepositData(data.mnemonic, index, data.withdrawalAddress),
        coordinatorKey: await Web3.utils.getKeyStore(data.mnemonic, index, coordinatorPassword),
        validatorKey: Web3.utils.getValidatorKeys(data.mnemonic, index, validatorPassword),
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
    }

    if (memoHash && !nodeModel.memoHash) {
      nodeModel.memoHash = memoHash
    }
    const workers = this.workerModel.insert(newWorkers, nodeModel)

    await node.addWorkers(keys)

    return workers
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
        `wat.validator.depositData({pubkey:"0x${worker.coordinatorPublicKey}", creator_address:"0x${worker.validatorAddress}", withdrawal_address:"0x${worker.withdrawalAddress}", signature:"0x${worker.signature}"})`
      )
      value = 3200
    } else if (action === ActionTxType.deActivate) {
      hexData = await node.runValidatorCommand(
        `wat.validator.exitData({pubkey:"0x${worker.coordinatorPublicKey}" , creator_address:"0x${worker.validatorAddress}"})`
      )
      value = 0
    } else if (action === ActionTxType.withdraw) {
      value = 0
      hexData = await node.runValidatorCommand(
        `wat.validator.withdrawalData({creator_address:"0x${worker.validatorAddress}", amount:web3.toWei("${amount}", "ether")})`
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

import { Node } from './node'
export enum Status {
  pending_initialized = 'pending_initialized',
  pending_activation = 'pending_activation',
  active = 'active',
  active_exiting = 'active_exiting',
  exited = 'exited'
}

export enum CoordinatorStatus {
  pending_initialized = 'pending_initialized',
  pending_queued = 'pending_queued',
  pending_activation = 'pending_activation',
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
  exited = 'exited'
}

export interface Worker {
  id: number | bigint
  nodeId: number | bigint
  node?: Node
  number: number
  coordinatorStatus: CoordinatorStatus
  coordinatorPublicKey: string
  coordinatorBalanceAmount: string
  coordinatorActivationEpoch: string
  coordinatorDeActivationEpoch: string
  coordinatorBlockCreationCount: number
  coordinatorAttestationCreationCount: number
  validatorStatus: ValidatorStatus
  validatorAddress: string
  validatorBalanceAmount: string
  validatorActivationEpoch: string
  validatorDeActivationEpoch: string
  validatorBlockCreationCount: number
  withdrawalAddress: string
  signature: string
  stakeAmount: string
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

export enum WorkersListDataFields {
  id = 'id',
  nodeId = 'nodeId',
  node = 'node',
  status = 'status',
  workedHours = 'workedHours',
  actions = 'actions'
}

export type WorkersListDataTypes = {
  [WorkersListDataFields.id]: string
  [WorkersListDataFields.nodeId]: string
  [WorkersListDataFields.node]: Node
  [WorkersListDataFields.status]?: string
  [WorkersListDataFields.workedHours]?: number
  [WorkersListDataFields.actions]?: {
    data?: any
    id: string
  }
}

export type WorkersT = {
  id: string
  node: string
  status?: string
  workedHours?: number
  depositData?: any
}

export type WorkerViewTabProps = {
  item?: Worker
}

//ADD WORKER
export enum AddWorkerFields {
  node = 'node',
  mnemonic = 'mnemonic',
  mnemonicVerify = 'mnemonicVerify',
  amount = 'amount',
  withdrawalAddress = 'withdrawalAddress'
}

export type AddWorkerFormValuesT = {
  [AddWorkerFields.mnemonic]: string[]
  [AddWorkerFields.mnemonicVerify]: Record<number, string>
  [AddWorkerFields.amount]: number
  [AddWorkerFields.withdrawalAddress]: string
}

//IMPORT WORKER
export enum ImportWorkerFields {
  node = 'node',
  mnemonic = 'mnemonic',
  withdrawalAddress = 'withdrawalAddress',
  keys = 'keys'
}

export type ImportWorkerFormValuesT = {
  [AddWorkerFields.node]: string
  [AddWorkerFields.mnemonic]: Record<number, string>
  [AddWorkerFields.withdrawalAddress]: string
}

//DISPLAY KEYS TABLE
export type DisplayKeysDataType = {
  id: string
  coordinatorKey?: string
  validatorKey?: string
  withdrawalAddress?: string
}

export enum DisplayKeysFields {
  id = 'id',
  coordinatorKey = 'coordinatorKey',
  validatorKey = 'validatorKey',
  withdrawalAddress = 'withdrawalAddress'
}

// SEND TRANSACTION TABLE

export enum WorkerTransactionTableFields {
  id = 'id',
  depositAddress = 'depositAddress',
  hexData = 'hexData',
  value = 'value',
  qr = 'qr'
}

export type WorkerTransactionTableData = {
  [WorkerTransactionTableFields.id]: string
  [WorkerTransactionTableFields.depositAddress]: string
  [WorkerTransactionTableFields.hexData]: string
  [WorkerTransactionTableFields.value]: string
  [WorkerTransactionTableFields.qr]: string
}

export interface ActionTx {
  from: string
  to: string
  value: number | bigint
  hexData: string
}

export enum ActionTxType {
  activate = 'activate',
  deActivate = 'deActivate',
  withdraw = 'withdraw'
}

export type ActionTxTypeMap = {
  [key in ActionTxType]: boolean
}

// Worker LIST TABLE
export enum WorkersListDataFields {
  id = 'id',
  node = 'node',
  status = 'status',
  workedHours = 'workedHours',
  actions = 'actions'
}

export type WorkersListDataTypes = {
  [WorkersListDataFields.id]: string
  [WorkersListDataFields.node]: string
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
  id?: string
}

//ADD WORKER
export enum AddWorkerFields {
  node = 'node',
  mnemonic = 'mnemonic',
  mnemonicVerify = 'mnemonicVerify',
  amount = 'amount',
  withdrawalAddress = 'withdrawalAddress',
  keys = 'keys'
}

export type AddWorkerFormValuesT = {
  [AddWorkerFields.node]: string
  [AddWorkerFields.mnemonic]: string[]
  [AddWorkerFields.mnemonicVerify]: Record<number, string>
  [AddWorkerFields.amount]: number | null
  [AddWorkerFields.withdrawalAddress]: string
  [AddWorkerFields.keys]: any
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
  [AddWorkerFields.keys]: any
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

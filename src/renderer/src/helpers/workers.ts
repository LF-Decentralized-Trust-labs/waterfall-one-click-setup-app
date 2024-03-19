import {
  Worker,
  CoordinatorStatus,
  ValidatorStatus,
  Status,
  ActionTxType
} from '@renderer/types/workers'
import { ActionTxTypeMap } from '../types/workers'
export const ImportWorkersStepKeys = {
  node: 'node',
  mnemonic: 'mnemonic',
  displayWorkers: 'displayWorkers',
  withdrawalAddress: 'withdrawalAddress',
  displayKeys: 'displayKeys',
  sendTransaction: 'sendTransaction'
}

export const getImportWorkersSteps = (node?: string | null) => {
  let stepsWithKeys = [
    {
      title: 'Enter a mnemonic phrase',
      key: ImportWorkersStepKeys.mnemonic
    },
    {
      title: 'Display #Workers and confirm import',
      key: ImportWorkersStepKeys.displayWorkers
    },
    {
      title: 'Select withdrawal address',
      key: ImportWorkersStepKeys.withdrawalAddress
    },
    {
      title: 'Display Workers keys',
      key: ImportWorkersStepKeys.displayKeys
    },
    {
      title: 'Send transaction to Staking',
      key: ImportWorkersStepKeys.sendTransaction
    }
  ]

  if (!node)
    stepsWithKeys = [{ title: 'Select a Node', key: ImportWorkersStepKeys.node }, ...stepsWithKeys]

  return {
    stepsWithKeys,
    steps: stepsWithKeys.map((el) => ({
      title: el.title
    }))
  }
}

export const AddWorkerStepKeys = {
  node: 'node',
  saveMnemonic: 'saveMnemonic',
  verifyMnemonic: 'verifyMnemonic',
  workersAmount: 'workersAmount',
  withdrawalAddress: 'withdrawalAddress',
  preview: 'preview'
}

export const getAddWorkerSteps = (node?: string | null) => {
  let stepsWithKeys = [
    {
      title: 'Save a mnemonic phrase',
      key: AddWorkerStepKeys.saveMnemonic
    },
    {
      title: 'Verify a mnemonic phrase',
      key: AddWorkerStepKeys.verifyMnemonic
    },
    {
      title: 'Select an amount of new Workers',
      key: AddWorkerStepKeys.workersAmount
    },
    {
      title: 'Select withdrawal address for Worker',
      key: AddWorkerStepKeys.withdrawalAddress
    },
    {
      title: 'Preview',
      key: AddWorkerStepKeys.preview
    }
  ]
  if (!node)
    stepsWithKeys = [{ title: 'Select a Node', key: AddWorkerStepKeys.node }, ...stepsWithKeys]

  return {
    stepsWithKeys,
    steps: stepsWithKeys.map((el) => ({
      title: el.title
    }))
  }
}

const StatusLabels = {
  [Status.pending_initialized]: 'Pending Initialized',
  [Status.pending_activation]: 'Pending Activation',
  [Status.active]: 'Active',
  [Status.active_exiting]: 'Exiting',
  [Status.exited]: 'Exited'
}

export const getStatusLabel = (worker: Worker) => {
  return StatusLabels[getStatus(worker)]
}
export const getStatus = (worker: Worker) => {
  if (
    worker.coordinatorStatus === CoordinatorStatus.pending_initialized &&
    worker.validatorStatus === ValidatorStatus.pending_initialized
  ) {
    return Status.pending_initialized
  } else if (
    worker.coordinatorStatus === CoordinatorStatus.pending_queued ||
    worker.coordinatorStatus === CoordinatorStatus.pending_activation ||
    worker.validatorStatus === ValidatorStatus.pending_initialized ||
    worker.validatorStatus === ValidatorStatus.pending_activation
  ) {
    return Status.pending_activation
  } else if (
    worker.coordinatorStatus === CoordinatorStatus.active_ongoing ||
    worker.coordinatorStatus === CoordinatorStatus.active_exiting ||
    worker.coordinatorStatus === CoordinatorStatus.active_slashed ||
    worker.validatorStatus === ValidatorStatus.active
  ) {
    return Status.active
  }
  return Status.exited
}

export const getActions = (worker?: Worker): ActionTxTypeMap => {
  return {
    [ActionTxType.activate]: worker ? getStatus(worker) === Status.pending_initialized : false,
    [ActionTxType.deActivate]: worker ? getStatus(worker) === Status.active : false,
    [ActionTxType.withdraw]: worker
      ? getStatus(worker) !== Status.pending_activation &&
        getStatus(worker) !== Status.pending_initialized
      : false
  }
}

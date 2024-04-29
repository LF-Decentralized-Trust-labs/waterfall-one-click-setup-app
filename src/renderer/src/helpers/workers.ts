import {
  Worker,
  CoordinatorStatus,
  ValidatorStatus,
  Status,
  ActionTxType,
  ActionTxTypeMap
} from '@renderer/types/workers'
import { Node, Status as NodeStatus } from '../types/node'
import { ethers } from 'ethers'
import { getNodeStatus } from './node'
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
  getMnemonic: 'getMnemonic',
  importMnemonic: 'importMnemonic',
  workersAmount: 'workersAmount',
  withdrawalAddress: 'withdrawalAddress',
  preview: 'preview'
}

export const getAddWorkerSteps = (node?: Node, mode: 'add' | 'import' = 'add') => {
  let stepsWithKeys = [{ title: 'Select a Node', key: AddWorkerStepKeys.node }]
  if (node) {
    if (node.workersCount === 0 && mode === 'add') {
      stepsWithKeys = [
        ...stepsWithKeys,
        ...[
          {
            title: 'Save a mnemonic phrase',
            key: AddWorkerStepKeys.saveMnemonic
          },
          {
            title: 'Verify a mnemonic phrase',
            key: AddWorkerStepKeys.verifyMnemonic
          }
        ]
      ]
    } else if (node.workersCount === 0 && mode === 'import') {
      stepsWithKeys = [
        ...stepsWithKeys,
        ...[
          {
            title: 'Provide a mnemonic phrase',
            key: AddWorkerStepKeys.importMnemonic
          }
        ]
      ]
    } else {
      stepsWithKeys = [
        ...stepsWithKeys,
        ...[
          {
            title: 'Provide a mnemonic phrase',
            key: AddWorkerStepKeys.getMnemonic
          }
        ]
      ]
    }
    stepsWithKeys = [
      ...stepsWithKeys,
      ...[
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
    ]
  }

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
      : false,
    [ActionTxType.remove]: worker?.node ? getNodeStatus(worker.node) === NodeStatus.stopped : false
  }
}

export const verifyMnemonic = (memo: string, memoHash: string) => {
  const bytes = ethers.toUtf8Bytes(memo)
  const hexStr = ethers.hexlify(bytes)
  const hash = ethers.keccak256(hexStr)
  return hash === memoHash
}

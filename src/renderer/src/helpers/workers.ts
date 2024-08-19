import {
  Worker,
  CoordinatorStatus,
  ValidatorStatus,
  Status,
  ActionTxType,
  ActionTxTypeMap
} from '@renderer/types/workers'
import { Node, Status as NodeStatus, Type as NodeType } from '../types/node'
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
      title: 'Display #Validators and confirm import',
      key: ImportWorkersStepKeys.displayWorkers
    },
    {
      title: 'Select withdrawal address',
      key: ImportWorkersStepKeys.withdrawalAddress
    },
    {
      title: 'Display Validators keys',
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
  depositData: 'depositData',
  delegateRules: 'delegateRules',
  preview: 'preview'
}

export const getAddWorkerSteps = (node?: Node, mode: 'add' | 'import' = 'add') => {
  let stepsWithKeys = [{ title: 'Select a Node', key: AddWorkerStepKeys.node }]
  if (node) {
    if (node.type === NodeType.provider) {
      stepsWithKeys = [
        ...stepsWithKeys,
        ...[
          {
            title: 'Select a deposit data',
            key: AddWorkerStepKeys.depositData
          },
          {
            title: 'Select a delegate rules',
            key: AddWorkerStepKeys.delegateRules
          }
        ]
      ]
    } else if (node.workersCount === 0 && mode === 'add') {
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
          },
          {
            title: 'Select an amount of new Validators',
            key: AddWorkerStepKeys.workersAmount
          },
          {
            title: 'Select withdrawal address for Validator',
            key: AddWorkerStepKeys.withdrawalAddress
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
          },
          {
            title: 'Select an amount of new Validators',
            key: AddWorkerStepKeys.workersAmount
          },
          {
            title: 'Select withdrawal address for Validator',
            key: AddWorkerStepKeys.withdrawalAddress
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
          },
          {
            title: 'Select an amount of new Validators',
            key: AddWorkerStepKeys.workersAmount
          },
          {
            title: 'Select withdrawal address for Validator',
            key: AddWorkerStepKeys.withdrawalAddress
          }
        ]
      ]
    }
    stepsWithKeys = [
      ...stepsWithKeys,
      ...[
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
    [ActionTxType.remove]:
      worker?.node && worker?.node?.type === NodeType.local
        ? getNodeStatus(worker.node) === NodeStatus.stopped
        : true
  }
}

export const getMassActions = (workers?: Worker[]): ActionTxTypeMap => {
  if (!workers || workers.length === 0) {
    return {
      [ActionTxType.activate]: false,
      [ActionTxType.deActivate]: false,
      [ActionTxType.withdraw]: false,
      [ActionTxType.remove]: false
    }
  }
  const result = {
    [ActionTxType.activate]: true,
    [ActionTxType.deActivate]: true,
    [ActionTxType.withdraw]: true,
    [ActionTxType.remove]: true
  }
  workers.forEach((w) => {
    const actions = getActions(w)
    Object.keys(result).forEach((key) => {
      if (result[key] === false) return
      result[key] = actions[key]
    })
  })
  return result
}

export const verifyMnemonic = (memo: string, memoHash: string) => {
  const bytes = ethers.toUtf8Bytes(memo)
  const hexStr = ethers.hexlify(bytes)
  const hash = ethers.keccak256(hexStr)
  return hash === memoHash
}

export const geFromAddress = (type: ActionTxType, worker: Worker): string[] => {
  if (!worker.delegate) {
    return [`0x${worker.withdrawalAddress.toLowerCase().replace('0x', '')}`]
  }

  try {
    const delegate = worker.delegate
    if (
      delegate.trial_period &&
      delegate.trial_rules &&
      delegate.trial_period > 0 &&
      worker?.node?.coordinatorFinalizedEpoch
    ) {
      const currentEpoch = worker.node.coordinatorFinalizedEpoch
      if (parseInt(worker.validatorActivationEpoch) + delegate.trial_period * 32 < currentEpoch) {
        if (type === ActionTxType.withdraw) {
          return delegate.trial_rules.withdrawal.map((a: string) => a.toLowerCase())
        } else if (type === ActionTxType.deActivate) {
          return delegate.trial_rules.exit.map((a: string) => a.toLowerCase())
        }
      }
    }
    if (type === ActionTxType.withdraw) {
      return delegate.rules.withdrawal.map((a: string) => a.toLowerCase())
    } else if (type === ActionTxType.deActivate) {
      return delegate.rules.exit.map((a: string) => a.toLowerCase())
    }
  } catch (e) {
    console.error(e)
    return []
  }

  return []
}

export const getMassFromAddress = (
  type: ActionTxType | null,
  workers: Worker[]
): null | string[] => {
  if (!type || workers.length === 0) return []
  return getCommonInnerArray(workers.map((w) => geFromAddress(type, w)))
}

function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

function getCommonInnerArray(arr: string[][]): string[] | null {
  if (arr.length === 0) return []
  const firstArray = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (!arraysEqual(firstArray, arr[i])) {
      return null
    }
  }
  return firstArray
}

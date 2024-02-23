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
  displayKeys: 'displayKeys',
  sendTransaction: 'sendTransaction'
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
      title: 'Display Workers keys',
      key: AddWorkerStepKeys.displayKeys
    },
    {
      title: 'Send transaction to activate Worker',
      key: AddWorkerStepKeys.sendTransaction
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

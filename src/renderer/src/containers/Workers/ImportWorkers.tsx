import React from 'react'
import { StepProps, Steps } from 'antd'
import { ImportWorkersStepKeys } from '@renderer/helpers/workers'

type ImportWorkerPropsT = {
  steps: Partial<StepProps>[]
  stepsWithKeys: Partial<StepProps & { key: string }>[]
  step: number
  onChangeStep: (value: number) => void
  goNextStep: () => void
  goPrevStep: () => void
}

export const ImportWorkers: React.FC<ImportWorkerPropsT> = ({
  steps,
  stepsWithKeys,
  step,
  onChangeStep
}) => {
  const StepComponent = {
    [ImportWorkersStepKeys.node]: <div>Node Step</div>,
    [ImportWorkersStepKeys.mnemonic]: <div>mnemonic</div>,
    [ImportWorkersStepKeys.displayWorkers]: <div>displayWorkers</div>,
    [ImportWorkersStepKeys.withdrawalAddress]: <div>withdrawalAddress</div>,
    [ImportWorkersStepKeys.displayKeys]: <div>displayKeys</div>,
    [ImportWorkersStepKeys.sendTransaction]: <div>sendTransaction</div>
  }
  const currentKey = stepsWithKeys?.[step].key

  return (
    <>
      <Steps direction="vertical" current={step} onChange={onChangeStep} items={steps} />
      {currentKey && StepComponent[currentKey]}
    </>
  )
}

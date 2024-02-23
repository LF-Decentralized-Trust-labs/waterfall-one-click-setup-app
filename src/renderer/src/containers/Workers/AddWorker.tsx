import React, { useEffect, useState } from 'react'
import { Flex, Input, InputNumber, Select, StepProps } from 'antd'
import { AddWorkerStepKeys } from '@renderer/helpers/workers'
import { useAddWorker } from '@renderer/hooks/workers'
import { AddWorkerForm } from '@renderer/components/Workers/AddWorker/AddWorkerForm'
import {
  AddWorkerFields,
  DisplayKeysFields,
  WorkerTransactionTableFields
} from '@renderer/types/workers'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { StepsWithActiveContent } from '@renderer/ui-kit/Steps/Steps'
import { GenerateMnemonic } from '@renderer/ui-kit/Mnemonic/GenerateMnemonic'
import { VerifyMnemonic } from '@renderer/ui-kit/Mnemonic/VerifyMnemonic'
import { WorkerKeysTable } from '@renderer/components/Workers/AddWorker/WorkerKeysTable'
import { WorkerTransactionTable } from '@renderer/components/Workers/AddWorker/WorkerTransactionTable'

type AddWorkerPropsT = {
  steps: Partial<StepProps>[]
  stepsWithKeys: Partial<StepProps & { key: string }>[]
  step: number
  onChangeStep: (value: number) => void
  goNextStep: () => void
  goPrevStep: () => void
}

export const AddWorker: React.FC<AddWorkerPropsT> = ({
  steps,
  stepsWithKeys,
  step,
  onChangeStep,
  goNextStep,
  goPrevStep
}) => {
  const { values, handleChange } = useAddWorker()

  const StepComponent = {
    [AddWorkerStepKeys.node]: (
      <NodeSelect
        value={values[AddWorkerFields.node]}
        onChange={handleChange(AddWorkerFields.node)}
        goNext={goNextStep}
        goPrev={goPrevStep}
      />
    ),
    [AddWorkerStepKeys.saveMnemonic]: (
      <SaveMnemonic goNext={goNextStep} goPrev={goPrevStep} phrase={values.mnemonic} />
    ),
    [AddWorkerStepKeys.verifyMnemonic]: (
      <VerifyMnemonicPhrase
        goNext={goNextStep}
        goPrev={goPrevStep}
        phrase={values.mnemonic}
        onChange={handleChange(AddWorkerFields.mnemonicVerify)}
        value={values.mnemonicVerify}
      />
    ),
    [AddWorkerStepKeys.workersAmount]: (
      <WorkersAmount
        goNext={goNextStep}
        goPrev={goPrevStep}
        onChange={handleChange(AddWorkerFields.amount)}
        value={values.amount}
      />
    ),
    [AddWorkerStepKeys.withdrawalAddress]: (
      <WithdrawalAddress
        goNext={goNextStep}
        goPrev={goPrevStep}
        onChange={handleChange(AddWorkerFields.withdrawalAddress)}
        value={values.withdrawalAddress}
      />
    ),
    [AddWorkerStepKeys.displayKeys]: <DisplayKeys goNext={goNextStep} goPrev={goPrevStep} />,
    [AddWorkerStepKeys.sendTransaction]: (
      <SendTransactionTable goNext={goNextStep} goPrev={goPrevStep} />
    )
  }

  const stepsWithContent = steps.map((el, index) => {
    const currentKey = stepsWithKeys?.[index].key
    const activeStep = index === step
    return {
      title: el?.title,
      description: activeStep ? currentKey && StepComponent[currentKey] : null
    }
  })
  return (
    <>
      <StepsWithActiveContent
        direction="vertical"
        current={step}
        onChange={onChangeStep}
        items={stepsWithContent}
      />
    </>
  )
}

type BasePropsT = {
  goNext: () => void
  goPrev: () => void
}

const NodeSelect: React.FC<
  BasePropsT & {
    value?: string
    onChange?: (val?: string) => void
  }
> = ({ value, onChange, goNext }) => {
  const options = [{ label: 'Test Node 1', value: '1' }]
  return (
    <AddWorkerForm title="Select a Node" goNext={goNext} canGoNext={!!value}>
      <Select options={options} onChange={onChange} value={value} style={{ width: '200px' }} />
    </AddWorkerForm>
  )
}

const SaveMnemonic: React.FC<BasePropsT & { phrase: string[] }> = ({ goNext, goPrev, phrase }) => {
  const [copy, setCopy] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(phrase.join(' '))
    setCopy(true)
  }
  useEffect(() => {
    copy && setTimeout(() => setCopy(false), 2500)
  }, [copy])
  return (
    <AddWorkerForm
      title="Save next phrases to restore keys in future:"
      extra={
        <Flex gap={10}>
          <ButtonPrimary ghost onClick={handleCopy}>
            {copy ? 'Copied' : 'Copy'}
          </ButtonPrimary>
          <ButtonPrimary>Save in a file</ButtonPrimary>
        </Flex>
      }
      goNext={goNext}
      goPrev={goPrev}
    >
      <GenerateMnemonic phrase={phrase} />
    </AddWorkerForm>
  )
}

const VerifyMnemonicPhrase: React.FC<
  BasePropsT & {
    phrase: string[]
    value: Record<number, string>
    onChange: (value: Record<number, string>) => void
  }
> = ({ goNext, goPrev, phrase, value, onChange }) => {
  const isValid = phrase.join('') === Object.values(value).join('')

  return (
    <AddWorkerForm
      title="Verify a mnemonic phrase. Select the words in correct order"
      goNext={goNext}
      goPrev={goPrev}
      canGoNext={isValid}
    >
      <VerifyMnemonic phrase={phrase} value={value} handleChange={onChange} />
    </AddWorkerForm>
  )
}

const WorkersAmount: React.FC<
  BasePropsT & { value: number | null; onChange: (value: number | null) => void }
> = ({ goNext, goPrev, value, onChange }) => {
  return (
    <AddWorkerForm
      title="Select the number of Workers that you want to add"
      goNext={goNext}
      goPrev={goPrev}
      canGoNext={!!value}
    >
      <InputNumber min={1} max={100} value={value} onChange={onChange} />
    </AddWorkerForm>
  )
}

const WithdrawalAddress: React.FC<
  BasePropsT & { value?: string; onChange: (value?: string) => void }
> = ({ goNext, goPrev, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)
  return (
    <AddWorkerForm
      title="Enter your withdrawal address"
      goNext={goNext}
      goPrev={goPrev}
      canGoNext={!!value}
    >
      <Input value={value} onChange={handleChange} style={{ maxWidth: '400px' }} />
    </AddWorkerForm>
  )
}

const DisplayKeys: React.FC<BasePropsT> = ({ goNext, goPrev }) => {
  const data = [
    {
      key: '1',
      [DisplayKeysFields.id]: '1',
      [DisplayKeysFields.coordinatorKey]: '3kj3kj3kj34l4kl4l3k4l',
      [DisplayKeysFields.validatorKey]: '5dj3463kj34l4kl4l3k4l',
      [DisplayKeysFields.withdrawalAddress]: '0xDccA352601a464e8d629A2E8CFBa9C1a27612751'
    }
  ]
  return (
    <AddWorkerForm goNext={goNext} goPrev={goPrev} canGoNext={true}>
      <WorkerKeysTable data={data} />
    </AddWorkerForm>
  )
}

const SendTransactionTable: React.FC<BasePropsT> = ({ goNext, goPrev }) => {
  const data = [
    {
      key: '1',
      [WorkerTransactionTableFields.id]: '1',
      [WorkerTransactionTableFields.depositAddress]: '0xDccA352601a464e8d629A2E8CFBa9C1a27612751',
      [WorkerTransactionTableFields.hexData]: '1',
      [WorkerTransactionTableFields.value]: '320',
      [WorkerTransactionTableFields.qr]: ''
    },
    {
      key: '2',
      [WorkerTransactionTableFields.id]: '2',
      [WorkerTransactionTableFields.depositAddress]: '0xDccA352601a464e8d629A2E8CFBa9C1a27612751',
      [WorkerTransactionTableFields.hexData]: '1',
      [WorkerTransactionTableFields.value]: '320',
      [WorkerTransactionTableFields.qr]: 'test'
    }
  ]
  return (
    <AddWorkerForm
      goNext={goNext}
      goPrev={goPrev}
      canGoNext={true}
      nextText="I have sent the deposits"
    >
      <WorkerTransactionTable data={data} />
    </AddWorkerForm>
  )
}

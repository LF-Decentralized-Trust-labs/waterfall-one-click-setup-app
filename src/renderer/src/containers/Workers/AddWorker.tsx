import React, { useEffect, useState } from 'react'
import { Flex, Input, InputNumber, Select, StepProps } from 'antd'
import { AddWorkerStepKeys } from '@renderer/helpers/workers'
import { isAddress } from '../../helpers/common'
import { useAddWorker } from '@renderer/hooks/workers'
import { AddWorkerForm } from '@renderer/components/Workers/AddWorker/AddWorkerForm'
import { AddWorkerPreview } from '@renderer/components/Workers/AddWorker/AddWorkerPreview'
import { AddWorkerFields, AddWorkerFormValuesT } from '@renderer/types/workers'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { StepsWithActiveContent } from '@renderer/ui-kit/Steps/Steps'
import { GenerateMnemonic } from '@renderer/ui-kit/Mnemonic/GenerateMnemonic'
import { VerifyMnemonic } from '@renderer/ui-kit/Mnemonic/VerifyMnemonic'
import { Node } from '@renderer/types/node'

type AddWorkerPropsT = {
  steps: Partial<StepProps>[]
  stepsWithKeys: Partial<StepProps & { key: string }>[]
  step: number
  onChangeStep: (value: number) => void
  goNextStep: () => void
  goPrevStep: () => void
  nodes?: Node[]
  node?: Node
}

export const AddWorker: React.FC<AddWorkerPropsT> = ({
  steps,
  stepsWithKeys,
  step,
  onChangeStep,
  goNextStep,
  goPrevStep,
  nodes,
  node
}) => {
  const { values, handleChange, handleSaveMnemonic, onAdd } = useAddWorker(node, nodes)

  const StepComponent = {
    [AddWorkerStepKeys.node]: (
      <NodeSelect
        data={nodes}
        value={values[AddWorkerFields.node]}
        onChange={handleChange(AddWorkerFields.node)}
        goNext={goNextStep}
        goPrev={goPrevStep}
      />
    ),
    [AddWorkerStepKeys.saveMnemonic]: (
      <SaveMnemonic
        goNext={goNextStep}
        goPrev={goPrevStep}
        phrase={values[AddWorkerFields.mnemonic]}
        onSaveFile={handleSaveMnemonic}
      />
    ),
    [AddWorkerStepKeys.verifyMnemonic]: (
      <VerifyMnemonicPhrase
        goNext={goNextStep}
        goPrev={goPrevStep}
        phrase={values[AddWorkerFields.mnemonic]}
        onChange={handleChange(AddWorkerFields.mnemonicVerify)}
        value={values[AddWorkerFields.mnemonicVerify]}
      />
    ),
    [AddWorkerStepKeys.workersAmount]: (
      <WorkersAmount
        goNext={goNextStep}
        goPrev={goPrevStep}
        onChange={handleChange(AddWorkerFields.amount)}
        value={values[AddWorkerFields.amount]}
      />
    ),
    [AddWorkerStepKeys.withdrawalAddress]: (
      <WithdrawalAddress
        goNext={goNextStep}
        goPrev={goPrevStep}
        onChange={handleChange(AddWorkerFields.withdrawalAddress)}
        value={values[AddWorkerFields.withdrawalAddress]}
      />
    ),
    [AddWorkerStepKeys.preview]: (
      <Preview values={values} node={node} nodes={nodes} goNext={onAdd} goPrev={goPrevStep} />
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
    data?: Node[]
  }
> = ({ value, onChange, goNext, data }) => {
  const options = data?.map((node) => ({ label: node.name, value: node.id.toString() }))
  const canGoNext = data && value && data.find((node) => node.id === parseInt(value))
  return (
    <AddWorkerForm title="Select a Node" goNext={goNext} canGoNext={!!canGoNext}>
      <Select options={options} onChange={onChange} value={value} style={{ width: '200px' }} />
    </AddWorkerForm>
  )
}

const SaveMnemonic: React.FC<BasePropsT & { phrase: string[]; onSaveFile: () => void }> = ({
  goNext,
  goPrev,
  phrase,
  onSaveFile
}) => {
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
          <ButtonPrimary onClick={() => onSaveFile()}>Save in a file</ButtonPrimary>
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
  const [status, setStatus] = useState<'' | 'error'>('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)

  useEffect(() => {
    setStatus(value && !isAddress(value) ? 'error' : '')
  }, [value])

  return (
    <AddWorkerForm
      title="Enter your withdrawal address"
      goNext={goNext}
      goPrev={goPrev}
      canGoNext={!!value}
    >
      <Input status={status} value={value} onChange={handleChange} style={{ maxWidth: '400px' }} />
    </AddWorkerForm>
  )
}

const Preview: React.FC<
  BasePropsT & { values: AddWorkerFormValuesT; node?: Node; nodes?: Node[] }
> = ({ goNext, goPrev, values, node, nodes }) => {
  const _node =
    node || (nodes && nodes.find((node) => node.id === parseInt(values[AddWorkerFields.node])))
  const canGoNext =
    !!_node &&
    !!values[AddWorkerFields.mnemonic] &&
    !!values[AddWorkerFields.amount] &&
    !!values[AddWorkerFields.withdrawalAddress] &&
    values[AddWorkerFields.mnemonic].join('') ===
      Object.values(values[AddWorkerFields.mnemonicVerify]).join('')

  return (
    <AddWorkerForm goNext={goNext} goPrev={goPrev} canGoNext={canGoNext} nextText="Add">
      <AddWorkerPreview data={values} node={_node} />
    </AddWorkerForm>
  )
}

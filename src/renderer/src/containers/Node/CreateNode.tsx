import React from 'react'
import { Steps } from 'antd'
import { NodeCreateForm } from '@renderer/components/Node/AddNode/Form'
import { useCreateNode } from '@renderer/hooks/node'
import { CreateNodeFields } from '@renderer/types/node'
import {
  NodeNetworkInput,
  NodeDataFolderInput,
  NodeNameInput
} from '@renderer/components/Node/AddNode/Inputs'

type CreateNodePropsT = {
  step: number
  onChangeStep: (value: number) => void
  goNextStep: () => void
  goPrevStep: () => void
}

const stepItems = [
  {
    title: 'Step 1',
    description: 'Select a network',
  },
  {
    title: 'Step 2',
    description: 'Select a data folder',
  },
  {
    title: 'Step 3',
    description: 'Name your node',
  }
]

export const CreateNode: React.FC<CreateNodePropsT> = ({
  step,
  onChangeStep,
  goNextStep,
  goPrevStep
}) => {
  const { handleChange, values, onCreate } = useCreateNode()
  return (
    <>
      <Steps direction="horizontal" current={step} onChange={onChangeStep} items={stepItems} />
      {step === 0 && (
        <NetworkSelection
          value={values[CreateNodeFields.network]}
          handleChange={handleChange(CreateNodeFields.network)}
          field={CreateNodeFields.network}
          goNextStep={goNextStep}
          goPrevStep={goPrevStep}
        />
      )}
      {step === 1 && (
        <FolderSelection
          value={values[CreateNodeFields.dataFolder]}
          handleChange={handleChange(CreateNodeFields.dataFolder)}
          field={CreateNodeFields.dataFolder}
          goNextStep={goNextStep}
          goPrevStep={goPrevStep}
        />
      )}
      {step === 2 && (
        <NameSelection
          value={values[CreateNodeFields.name]}
          handleChange={handleChange(CreateNodeFields.name)}
          field={CreateNodeFields.name}
          goNextStep={onCreate}
          goPrevStep={goPrevStep}
        />
      )}
    </>
  )
}

const NetworkSelection: React.FC<SelectionBasePropsT> = ({ value, handleChange, goNextStep }) => {
  return (
    <NodeCreateForm title="Select a network" goNext={goNextStep} canGoNext={!!value}>
      <NodeNetworkInput value={value} handleChange={handleChange} />
    </NodeCreateForm>
  )
}

const FolderSelection: React.FC<SelectionBasePropsT> = ({
  value,
  handleChange,
  goNextStep,
  goPrevStep
}) => {
  return (
    <NodeCreateForm
      title="Select a data folder"
      goNext={goNextStep}
      goPrev={goPrevStep}
      canGoNext={!!value}
    >
      <NodeDataFolderInput
        value={value}
        handleChange={handleChange}
        // error={'The directory and network does not match'}
      />
    </NodeCreateForm>
  )
}

const NameSelection: React.FC<SelectionBasePropsT> = ({
  value,
  handleChange,
  goNextStep,
  goPrevStep
}) => {
  return (
    <NodeCreateForm
      title="Name your node"
      goNext={goNextStep}
      goPrev={goPrevStep}
      canGoNext={!!value}
    >
      <NodeNameInput handleChange={handleChange} value={value} />
    </NodeCreateForm>
  )
}

type SelectionBasePropsT = {
  value: string
  field: CreateNodeFields
  handleChange: (value?: string) => void

  //steps
  goNextStep: () => void | Promise<void>
  goPrevStep: () => void
}

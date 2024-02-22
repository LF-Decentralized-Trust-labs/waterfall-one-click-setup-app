import React from 'react'
import { Steps } from 'antd'
import { NodeAddForm } from '@renderer/components/Node/AddNode/Form'
import { useAddNode } from '@renderer/hooks/node'
import { AddNodeFields } from '@renderer/types/node'
import {
  NodeNetworkInput,
  NodeDataFolderInput,
  NodeNameInput
} from '@renderer/components/Node/AddNode/Inputs'

type AddNodePropsT = {
  step: number
  onChangeStep: (value: number) => void
  goNextStep: () => void
  goPrevStep: () => void
}

const stepItems = [
  {
    title: 'Step 1',
    description: 'Select a network'
  },
  {
    title: 'Step 2',
    description: 'Select a data folder'
  },
  {
    title: 'Step 3',
    description: 'Name your node'
  }
]

export const AddNode: React.FC<AddNodePropsT> = ({
  step,
  onChangeStep,
  goNextStep,
  goPrevStep
}) => {
  const { handleChange, values, onAdd } = useAddNode()
  return (
    <>
      <Steps direction="horizontal" current={step} onChange={onChangeStep} items={stepItems} />
      {step === 0 && (
        <NetworkSelection
          value={values[AddNodeFields.network]}
          handleChange={handleChange(AddNodeFields.network)}
          field={AddNodeFields.network}
          goNextStep={goNextStep}
          goPrevStep={goPrevStep}
        />
      )}
      {step === 1 && (
        <FolderSelection
          value={values[AddNodeFields.dataFolder]}
          handleChange={handleChange(AddNodeFields.dataFolder)}
          field={AddNodeFields.dataFolder}
          goNextStep={goNextStep}
          goPrevStep={goPrevStep}
        />
      )}
      {step === 2 && (
        <NameSelection
          value={values[AddNodeFields.name]}
          handleChange={handleChange(AddNodeFields.name)}
          field={AddNodeFields.name}
          goNextStep={onAdd}
          goPrevStep={goPrevStep}
        />
      )}
    </>
  )
}

const NetworkSelection: React.FC<SelectionBasePropsT> = ({ value, handleChange, goNextStep }) => {
  return (
    <NodeAddForm title="Select a network" goNext={goNextStep} canGoNext={!!value}>
      <NodeNetworkInput value={value} handleChange={handleChange} type="local" />
    </NodeAddForm>
  )
}

const FolderSelection: React.FC<SelectionBasePropsT> = ({
  value,
  handleChange,
  goNextStep,
  goPrevStep
}) => {
  return (
    <NodeAddForm
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
    </NodeAddForm>
  )
}

const NameSelection: React.FC<SelectionBasePropsT> = ({
  value,
  handleChange,
  goNextStep,
  goPrevStep
}) => {
  return (
    <NodeAddForm title="Name your node" goNext={goNextStep} goPrev={goPrevStep} canGoNext={!!value}>
      <NodeNameInput handleChange={handleChange} value={value} />
    </NodeAddForm>
  )
}

type SelectionBasePropsT = {
  value: string
  field: AddNodeFields
  handleChange: (value?: string) => void

  //steps
  goNextStep: () => void | Promise<void>
  goPrevStep: () => void
}

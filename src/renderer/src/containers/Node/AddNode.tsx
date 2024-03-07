import React from 'react'
import { NodeAddForm } from '@renderer/components/Node/AddNode/Form'
import { useAddNode } from '@renderer/hooks/node'
import { AddNodeFields, Type as NODE_TYPE } from '@renderer/types/node'
import {
  NodeNetworkInput,
  NodeDataFolderInput,
  NodeNameInput,
  NodeTypeInput
} from '@renderer/components/Node/AddNode/Inputs'
import { StepsWithActiveContent } from '@renderer/ui-kit/Steps/Steps'

type AddNodePropsT = {
  step: number
  onChangeStep: (value: number) => void
  goNextStep: () => void
  goPrevStep: () => void
}

const stepItems = [
  {
    title: 'Select Node type'
  },
  {
    title: 'Select a network'
  },
  {
    title: 'Select a data folder'
  },
  {
    title: 'Name your node'
  }
]

export const AddNode: React.FC<AddNodePropsT> = ({
  step,
  onChangeStep,
  goNextStep,
  goPrevStep
}) => {
  const { handleChange, values, onAdd } = useAddNode()
  const stepsComponents = {
    0: (
      <NodeTypeSelection
        value={values[AddNodeFields.type]}
        handleChange={handleChange(AddNodeFields.type)}
        field={AddNodeFields.type}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    1: (
      <NetworkSelection
        value={values[AddNodeFields.network]}
        handleChange={handleChange(AddNodeFields.network)}
        field={AddNodeFields.network}
        nodeType={values[AddNodeFields.type]}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    2: (
      <FolderSelection
        value={values[AddNodeFields.dataFolder]}
        handleChange={handleChange(AddNodeFields.dataFolder)}
        field={AddNodeFields.dataFolder}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    3: (
      <NameSelection
        value={values[AddNodeFields.name]}
        handleChange={handleChange(AddNodeFields.name)}
        field={AddNodeFields.name}
        goNextStep={onAdd}
        goPrevStep={goPrevStep}
      />
    )
  }
  const stepsWithComponents = stepItems.map((el, index) => ({
    title: el?.title,
    description: stepsComponents?.[index] || null
  }))
  return (
    <StepsWithActiveContent
      direction="vertical"
      current={step}
      onChange={onChangeStep}
      items={stepsWithComponents}
    />
  )
}

const NodeTypeSelection: React.FC<SelectionBasePropsT> = ({ value, handleChange, goNextStep }) => {
  return (
    <NodeAddForm title="Select a Node type" goNext={goNextStep} canGoNext={!!value}>
      <NodeTypeInput value={value} handleChange={handleChange} />
    </NodeAddForm>
  )
}

const NetworkSelection: React.FC<SelectionBasePropsT & { nodeType: NODE_TYPE }> = ({
  value,
  handleChange,
  goNextStep,
  nodeType
}) => {
  return (
    <NodeAddForm title="Select a network" goNext={goNextStep} canGoNext={!!value}>
      <NodeNetworkInput value={value} handleChange={handleChange} type={nodeType} />
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

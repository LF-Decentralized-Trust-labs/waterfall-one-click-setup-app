import React from 'react'
import { NodeAddForm } from '@renderer/components/Node/AddNode/Form'
import { useAddNode } from '@renderer/hooks/node'
import { AddNodeFields, NewNode } from '@renderer/types/node'
import {
  NodeNetworkInput,
  NodeDataFolderInput,
  NodeNameInput,
  NodeTypeInput,
  NodePreview
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
  },
  {
    title: 'Preview'
  }
]

export const AddNode: React.FC<AddNodePropsT> = ({
  step,
  onChangeStep,
  goNextStep,
  goPrevStep
}) => {
  const { handleChange, values, onAdd, onSelectDirectory } = useAddNode()
  const stepsComponents = {
    0: (
      <NodeTypeSelection
        value={values[AddNodeFields.type]}
        values={values}
        handleChange={handleChange(AddNodeFields.type)}
        field={AddNodeFields.type}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    1: (
      <NetworkSelection
        value={values[AddNodeFields.network]}
        values={values}
        handleChange={handleChange(AddNodeFields.network)}
        field={AddNodeFields.network}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    2: (
      <FolderSelection
        value={values[AddNodeFields.locationDir]}
        values={values}
        handleChange={handleChange(AddNodeFields.locationDir)}
        field={AddNodeFields.locationDir}
        onSelectDirectory={onSelectDirectory}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    3: (
      <NameSelection
        value={values[AddNodeFields.name]}
        values={values}
        handleChange={handleChange(AddNodeFields.name)}
        field={AddNodeFields.name}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    4: <Preview values={values} goNextStep={onAdd} goPrevStep={goPrevStep} />
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

const NetworkSelection: React.FC<SelectionBasePropsT> = ({
  value,
  handleChange,
  goNextStep,
  goPrevStep
}) => {
  return (
    <NodeAddForm
      title="Select a network"
      goNext={goNextStep}
      goPrev={goPrevStep}
      canGoNext={!!value}
    >
      <NodeNetworkInput value={value} handleChange={handleChange} />
    </NodeAddForm>
  )
}

const FolderSelection: React.FC<SelectionBasePropsT & { onSelectDirectory: () => void }> = ({
  value,
  handleChange,
  onSelectDirectory,
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
        onSelectDirectory={onSelectDirectory}
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

const Preview: React.FC<PreviewPropsT> = ({ values, goNextStep, goPrevStep }) => {
  const canGoNext =
    !!values[AddNodeFields.type] &&
    !!values[AddNodeFields.network] &&
    !!values[AddNodeFields.locationDir] &&
    !!values[AddNodeFields.name]
  return (
    <NodeAddForm
      title="Name your node"
      goNext={goNextStep}
      goNextTitle="Add"
      goPrev={goPrevStep}
      canGoNext={canGoNext}
    >
      <NodePreview values={values} />
    </NodeAddForm>
  )
}

type PreviewPropsT = {
  values: NewNode
  //steps
  goNextStep: () => void | Promise<void>
  goPrevStep: () => void
}

type SelectionBasePropsT = {
  value: string
  values: NewNode
  field: AddNodeFields
  handleChange: (value?: string) => void

  //steps
  goNextStep: () => void | Promise<void>
  goPrevStep: () => void
}

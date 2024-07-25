import React from 'react'
import { NodeAddForm } from '@renderer/components/Node/AddNode/Form'
import { useAddNode } from '@renderer/hooks/node'
import { AddNodeFields, NewNode, CheckPorts, DownloadStatus } from '@renderer/types/node'
import {
  NodeNetworkInput,
  NodeDataFolderInput,
  NodeSnapshotInput,
  NodeNameInput,
  NodeTypeInput,
  NodePortInput,
  NodePreview
} from '@renderer/components/Node/AddNode/Inputs'
import { StepsWithActiveContent } from '@renderer/ui-kit/Steps/Steps'
import { Snapshot } from '../../types/node'

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
    title: 'Select ports'
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
  const {
    handleChange,
    values,
    onAdd,
    onSelectDirectory,
    checkPorts,
    onCheckPorts,
    isLoading,
    snapshot,
    onSelectSnapshot
  } = useAddNode()
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
        isSnapshot={values[AddNodeFields.downloadStatus] === DownloadStatus.downloading}
        snapshot={snapshot}
        onSelectSnapshot={onSelectSnapshot}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    3: (
      <PortsSelection
        values={values}
        checkPorts={checkPorts}
        onCheckPorts={onCheckPorts}
        handleChange={handleChange}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    4: (
      <NameSelection
        value={values[AddNodeFields.name]}
        values={values}
        handleChange={handleChange(AddNodeFields.name)}
        field={AddNodeFields.name}
        goNextStep={goNextStep}
        goPrevStep={goPrevStep}
      />
    ),
    5: <Preview values={values} goNextStep={onAdd} goPrevStep={goPrevStep} isLoading={isLoading} />
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

const FolderSelection: React.FC<
  SelectionBasePropsT & {
    onSelectDirectory: () => void
    snapshot?: Snapshot | null
    isSnapshot: boolean
    onSelectSnapshot: () => void
  }
> = ({
  value,
  handleChange,
  onSelectDirectory,
  goNextStep,
  goPrevStep,
  snapshot,
  isSnapshot,
  onSelectSnapshot
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
      {snapshot && (
        <>
          <br />
          <NodeSnapshotInput
            value={isSnapshot}
            handleChange={onSelectSnapshot}
            snapshot={snapshot}
          />
        </>
      )}
    </NodeAddForm>
  )
}

const PortsSelection: React.FC<PortsSelectionT> = ({
  values,
  checkPorts,
  onCheckPorts,
  handleChange,
  goNextStep,
  goPrevStep
}) => {
  return (
    <NodeAddForm title="Select ports" goNext={goNextStep} goPrev={goPrevStep}>
      <NodePortInput
        label="Coordinator P2P Tcp"
        handleChange={handleChange(AddNodeFields.coordinatorP2PTcpPort)}
        value={Number(values[AddNodeFields.coordinatorP2PTcpPort])}
        isCheck={checkPorts ? !!checkPorts[AddNodeFields.coordinatorP2PTcpPort] : true}
        onCheck={onCheckPorts}
      />
      <NodePortInput
        label="Coordinator P2P Udp"
        handleChange={handleChange(AddNodeFields.coordinatorP2PUdpPort)}
        value={Number(values[AddNodeFields.coordinatorP2PUdpPort])}
        isCheck={checkPorts ? !!checkPorts[AddNodeFields.coordinatorP2PUdpPort] : true}
        onCheck={onCheckPorts}
      />
      <NodePortInput
        label="Coordinator HTTP api"
        handleChange={handleChange(AddNodeFields.coordinatorHttpValidatorApiPort)}
        value={Number(values[AddNodeFields.coordinatorHttpValidatorApiPort])}
        isCheck={checkPorts ? !!checkPorts[AddNodeFields.coordinatorHttpValidatorApiPort] : true}
        onCheck={onCheckPorts}
      />
      <NodePortInput
        label="HTTP api"
        handleChange={handleChange(AddNodeFields.coordinatorHttpApiPort)}
        value={Number(values[AddNodeFields.coordinatorHttpApiPort])}
        isCheck={checkPorts ? !!checkPorts[AddNodeFields.coordinatorHttpApiPort] : true}
        onCheck={onCheckPorts}
      />
      <NodePortInput
        label="Verifier P2P"
        handleChange={handleChange(AddNodeFields.validatorP2PPort)}
        value={Number(values[AddNodeFields.validatorP2PPort])}
        isCheck={checkPorts ? !!checkPorts[AddNodeFields.validatorP2PPort] : true}
        onCheck={onCheckPorts}
      />
      <NodePortInput
        label="Verifier HTTP api"
        handleChange={handleChange(AddNodeFields.validatorHttpApiPort)}
        value={Number(values[AddNodeFields.validatorHttpApiPort])}
        isCheck={checkPorts ? !!checkPorts[AddNodeFields.validatorHttpApiPort] : true}
        onCheck={onCheckPorts}
      />
      <NodePortInput
        label="Verifier WS api"
        handleChange={handleChange(AddNodeFields.validatorWsApiPort)}
        value={Number(values[AddNodeFields.validatorWsApiPort])}
        isCheck={checkPorts ? !!checkPorts[AddNodeFields.validatorWsApiPort] : true}
        onCheck={onCheckPorts}
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

const Preview: React.FC<PreviewPropsT> = ({ values, goNextStep, goPrevStep, isLoading }) => {
  const canGoNext =
    !!values[AddNodeFields.type] &&
    !!values[AddNodeFields.network] &&
    !!values[AddNodeFields.locationDir] &&
    !!values[AddNodeFields.name]
  return (
    <NodeAddForm
      title="Preview"
      goNext={goNextStep}
      goNextTitle="Add"
      goPrev={goPrevStep}
      canGoNext={canGoNext}
      isLoading={isLoading}
    >
      <NodePreview values={values} />
    </NodeAddForm>
  )
}

type PreviewPropsT = {
  values: NewNode
  isLoading?: boolean
  //steps
  goNextStep: () => void | Promise<void>
  goPrevStep: () => void
}

type PortsSelectionT = {
  values: NewNode
  checkPorts?: CheckPorts
  onCheckPorts: () => void

  handleChange: (field: AddNodeFields) => (value: number | null) => void
  //steps
  goNextStep: () => void | Promise<void>
  goPrevStep: () => void
}

type SelectionBasePropsT = {
  value: string
  values: NewNode
  field: AddNodeFields
  handleChange: (value?: string | number) => void

  //steps
  goNextStep: () => void | Promise<void>
  goPrevStep: () => void
}

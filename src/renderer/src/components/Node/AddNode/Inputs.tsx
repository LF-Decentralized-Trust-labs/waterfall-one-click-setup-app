import React from 'react'
import { Input, Radio, RadioChangeEvent, Space, Flex } from 'antd'
import { NetworkOptions } from '@renderer/constants/network'
import { DataFolder } from '@renderer/ui-kit/DataFolder'
import { Text } from '@renderer/ui-kit/Typography'
import { styled } from 'styled-components'
import { Type as NODE_TYPE, NewNode, AddNodeFields } from '@renderer/types/node'

const node_type_options = [
  { value: NODE_TYPE.local, label: 'Local' },
  { value: NODE_TYPE.remote, label: 'Remote', disabled: true }
]

export const NodeTypeInput: React.FC<{
  value: string
  handleChange: (val: string) => void
}> = ({ handleChange, value }) => {
  const onChange = (e: RadioChangeEvent) => handleChange(e.target.value)
  return (
    <Radio.Group onChange={onChange} value={value}>
      <Space direction="vertical">
        {node_type_options.map((item) => (
          <Radio value={item.value} key={item.value} disabled={item?.disabled}>
            {item.label}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  )
}

export const NodeNetworkInput: React.FC<{
  value: string
  handleChange: (val: string) => void
}> = ({ handleChange, value }) => {
  const onChange = (e: RadioChangeEvent) => handleChange(e.target.value)
  return (
    <Radio.Group onChange={onChange} value={value}>
      <Space direction="vertical">
        {NetworkOptions.map((item) => (
          <Radio value={item.value} key={item.value} disabled={item?.disabled}>
            {item.label}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  )
}

export const NodeDataFolderInput: React.FC<{
  value: string
  handleChange: (val: string) => void
  onSelectDirectory: () => void
  error?: string
}> = ({ handleChange, value, onSelectDirectory, error }) => {
  return (
    <DataFolder
      value={value}
      handleChange={handleChange}
      onSelectDirectory={onSelectDirectory}
      errorMessage={error}
    />
  )
}

export const NodeNameInput: React.FC<{
  value: string
  handleChange: (val: string) => void
  error?: string
}> = ({ handleChange, value }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)

  return <StyledInput placeholder="Type Name here" onChange={onChange} value={value} />
}

export const NodePreview: React.FC<{
  values: NewNode
}> = ({ values }) => {
  return (
    <TabContentWrapper>
      <TextRow label="Name" value={values[AddNodeFields.name]} />
      <TextRow label="Type" value={values[AddNodeFields.type]} />
      <TextRow label="Network" value={values[AddNodeFields.network]} />
      <TextRow label="Path" value={values[AddNodeFields.locationDir]} />
    </TabContentWrapper>
  )
}

const TabContentWrapper = styled.div`
  //padding: 30px 30px 15px 5px;
  /* border: 1px solid ${({ theme }) => theme.palette.background.gray}; */

  //border-bottom-right-radius: 4px;
  //border-bottom-left-radius: 4px;
`
export const TextRow: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({
  label,
  value
}) => {
  return (
    <TextItem gap={6} align="center">
      <Text>{label}:</Text>
      <Text>{value}</Text>
    </TextItem>
  )
}

const TextItem = styled(Flex)`
  margin-bottom: 20px;
`
const StyledInput = styled(Input)`
  width: 100%;
  max-width: 360px;
`

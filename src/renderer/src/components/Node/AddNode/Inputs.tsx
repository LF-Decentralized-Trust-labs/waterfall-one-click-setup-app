import React from 'react'
import { Input, Radio, RadioChangeEvent, Space } from 'antd'
import { LocalNodeNetworkOptions } from '@renderer/constants/network'
import { DataFolder } from '@renderer/ui-kit/DataFolder'
import { styled } from 'styled-components'
import { NODE_TYPE } from '@renderer/types/node'

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
  type: NODE_TYPE
}> = ({ handleChange, value, type }) => {
  const onChange = (e: RadioChangeEvent) => handleChange(e.target.value)
  return (
    <Radio.Group onChange={onChange} value={value}>
      <Space direction="vertical">
        {type === 'local' &&
          LocalNodeNetworkOptions.map((item) => (
            <Radio value={item.value} key={item.value}>
              {item.label}
            </Radio>
          ))}
      </Space>
    </Radio.Group>
  )
}

const pathOptions = [
  {
    label: '/Volumes/H/.wf8',
    value: '/Volumes/H/.wf8'
  }
]

export const NodeDataFolderInput: React.FC<{
  value: string
  handleChange: (val: string) => void
  error?: string
}> = ({ handleChange, value, error }) => {
  return (
    <DataFolder
      value={value}
      onChange={handleChange}
      baseOptions={pathOptions}
      hideLabel
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

const StyledInput = styled(Input)`
  width: 100%;
  max-width: 360px;
`

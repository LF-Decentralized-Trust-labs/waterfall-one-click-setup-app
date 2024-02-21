import React from 'react'
import { Input, Radio, RadioChangeEvent, Space } from 'antd'
import { networkOptions } from '@renderer/constants/network'
import { DataFolder } from '@renderer/ui-kit/DataFolder'
import { styled } from 'styled-components'

export const NodeNetworkInput: React.FC<{
  value: string
  handleChange: (val: string) => void
}> = ({ handleChange, value }) => {
  const onChange = (e: RadioChangeEvent) => handleChange(e.target.value)
  return (
    <Radio.Group onChange={onChange} value={value}>
      <Space direction="vertical">
        {networkOptions.map((item) => (
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

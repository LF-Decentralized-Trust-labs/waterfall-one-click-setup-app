import { Select } from 'antd'
import React from 'react'
import { styled } from 'styled-components'

type PropsT = {
  options: { label?: string; value?: string }[]
  value?: string[]
  onChange?: (value?: string[]) => void
}

export const NodeSelector: React.FC<PropsT> = ({ options, value, onChange }) => {
  return (
    <SelectWrapper>
      <Select options={options} value={value} onChange={onChange} mode="multiple" />
    </SelectWrapper>
  )
}

const SelectWrapper = styled.div`
  .ant-select-selector {
    max-width: 200px;
    max-height: 40px;
    overflow-y: scroll;
  }
`

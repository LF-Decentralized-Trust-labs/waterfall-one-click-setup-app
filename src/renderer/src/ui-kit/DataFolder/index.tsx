import React from 'react'
import { styled } from 'styled-components'
import { DatabaseOutlined } from '@ant-design/icons'
import { Text } from '../Typography'
import { AutoComplete, Flex } from 'antd'
import { ButtonPrimary } from '../Button'
type DataFolderPropsT = {
  hideLabel?: boolean
  editable?: boolean
  hint?: string
  value?: string
}

export const DataFolder: React.FC<DataFolderPropsT> = ({ hideLabel, hint, editable, value }) => {
  return (
    <Wrapper>
      {!hideLabel && (
        <Label>
          <DatabaseOutlined />
          <Text>Data Folder</Text>
        </Label>
      )}
      <Flex dir="row" gap={10}>
        <Input
          // options={options}
          placeholder="/Volumes/H/.wf8"
          disabled={!editable}
          value={value}
        />
        {editable && <ButtonPrimary>Select</ButtonPrimary>}
      </Flex>
      {hint && <Hint>{hint}</Hint>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  max-width: 400px;
`

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
`

const Hint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.gray};
`

const Input = styled(AutoComplete)`
  width: 100%;
`

import React, { useState } from 'react'
import { styled } from 'styled-components'
import { DatabaseOutlined } from '@ant-design/icons'
import { Text } from '../Typography'
import { AutoComplete, Flex, SelectProps } from 'antd'
import { ButtonPrimary } from '../Button'

type DataFolderPropsT = {
  hideLabel?: boolean
  editable?: boolean
  errorMessage?: string
  value?: string
  onChange?: (val: string) => void
  placeholder?: string
  baseOptions?: { label: string; value: string }[]
}

export const DataFolder: React.FC<DataFolderPropsT> = ({
  hideLabel,
  errorMessage,
  editable = true,
  value,
  onChange,
  placeholder,
  baseOptions
}) => {
  const [searchValue, setSearchValue] = useState(value)
  const [options, setOptions] = useState<SelectProps<object>['options']>(baseOptions || [])

  const searchResult = (value: string) => {
    //search folder in options
    const result =
      baseOptions?.filter((el) => el?.value.toLowerCase().includes(value.toLowerCase())) || []
    return [...result]
  }

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : [])
  }

  const onSelect = (value: string) => {
    onChange(value)
    setSearchValue(value)
  }
  return (
    <Wrapper>
      {!hideLabel && (
        <Label>
          <DatabaseOutlined />
          <Text>Data Folder</Text>
        </Label>
      )}
      <InputWrapper gap={10}>
        <AutoComplete
          options={options}
          placeholder={placeholder}
          disabled={!editable}
          onSelect={onSelect}
          onSearch={handleSearch}
          value={searchValue}
        />
        {editable && <ButtonPrimary>Select</ButtonPrimary>}
      </InputWrapper>
      {errorMessage && <Error>{errorMessage}</Error>}
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

const Error = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ theme }) => theme.palette.text.red};
`
const InputWrapper = styled(Flex)`
  width: 100%;
  max-width: 360px;

  .ant-select {
    width: 100%;
  }
  & > .ant-btn {
    height: 32px;
  }
`

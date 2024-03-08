import React from 'react'
import { styled } from 'styled-components'
import { Input, Flex } from 'antd'
import { ButtonPrimary } from '../Button'

type DataFolderPropsT = {
  hideLabel?: boolean
  editable?: boolean
  errorMessage?: string
  value?: string
  handleChange: (val: string) => void
  placeholder?: string
  onSelectDirectory: () => void
}

export const DataFolder: React.FC<DataFolderPropsT> = ({
  errorMessage,
  value,
  handleChange,
  onSelectDirectory,
  placeholder
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)
  return (
    <Wrapper>
      <InputWrapper gap={10}>
        <StyledInput placeholder={placeholder} value={value} onChange={onChange} />
        {<ButtonPrimary onClick={() => onSelectDirectory()}>Select</ButtonPrimary>}
      </InputWrapper>
      {errorMessage && <Error>{errorMessage}</Error>}
    </Wrapper>
  )
}

const StyledInput = styled(Input)`
  width: 100%;
  max-width: 360px;
`

const Wrapper = styled.div`
  max-width: 400px;
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

import React from 'react'
import { styled } from 'styled-components'
import { Input, Flex } from 'antd'
import { ButtonPrimary } from '../Button'

type DataFilePropsT = {
  hideLabel?: boolean
  editable?: boolean
  errorMessage?: string
  value?: string
  handleChange: (val: string) => void
  placeholder?: string
  onSelectFile: () => void
}

export const DataFile: React.FC<DataFilePropsT> = ({
  errorMessage,
  value,
  handleChange,
  onSelectFile,
  placeholder
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)
  return (
    <Wrapper>
      <InputWrapper gap={10}>
        <StyledInput placeholder={placeholder} value={value} onChange={onChange} />
        {<ButtonPrimary onClick={() => onSelectFile()}>Select</ButtonPrimary>}
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

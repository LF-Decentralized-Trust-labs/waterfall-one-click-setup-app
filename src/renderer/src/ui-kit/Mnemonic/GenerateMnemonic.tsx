import { Input } from 'antd'
import React from 'react'
import { styled } from 'styled-components'

type GenerateMnemonicPropsT = {
  phrase: string[]
}

export const GenerateMnemonic: React.FC<GenerateMnemonicPropsT> = ({ phrase }) => {
  return (
    <Wrapper>
      {phrase.map((el, i) => (
        <Item key={el}>
          <Num>{i + 1}</Num>
          <PhraseInput value={el} />
        </Item>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 20px;
`

const Item = styled.div`
  width: 20%;
  margin: 0px 2px;
  position: relative;
`

const Num = styled.div`
  position: absolute;
  left: -12px;
  bottom: -6px;
  font-size: 9px;
`

const PhraseInput = styled(Input)`
  width: 90%;
  text-align: center;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0;
  outline: none;
  box-shadow: unset !important;
`

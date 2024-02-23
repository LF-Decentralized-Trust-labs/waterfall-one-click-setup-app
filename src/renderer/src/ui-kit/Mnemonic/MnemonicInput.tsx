import { Input } from 'antd'
import React, { useRef } from 'react'
import { styled } from 'styled-components'

type GenerateMnemonicPropsT = {
  value: Record<number, string>
  onChange: (value: Record<number, string>) => void
}

const inputs = Array.from(Array(24).keys())

export const MnemonicInput: React.FC<GenerateMnemonicPropsT> = ({ value, onChange }) => {
  const rootRef = useRef<HTMLDivElement>(null)

  const focusByIndex = (index: number) => {
    const input = rootRef.current?.querySelector<HTMLInputElement>(`input[name='input-${index}']`)
    input?.focus()
  }

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value
    if (nextValue.includes(' ')) {
      const words = nextValue.split(' ').slice(0, 24 - index)
      const nextValues = {}
      words?.forEach((el, i) => (nextValues[index + i] = el))
      onChange({ ...value, ...nextValues })
      focusByIndex(index + words.length - 1)
      return
    }
    onChange({ ...value, [index]: nextValue })
  }

  return (
    <Wrapper ref={rootRef}>
      {inputs.map((el, i) => (
        <Item key={el}>
          <Num>{i + 1}</Num>
          <PhraseInput value={value[i]} autoFocus onChange={handleChange(i)} name={`input-${i}`} />
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

import { Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'

type VerifyMnemonicPropsT = {
  phrase: string[]
  value: Record<number, string>
  handleChange: (value: Record<number, string>) => void
}

export const VerifyMnemonic: React.FC<VerifyMnemonicPropsT> = ({ phrase, value, handleChange }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [editableCells, setEditableCells] = useState<(number | null)[]>([])
  const [currentFocus, setCurrentFocus] = useState(Object.values(value).findIndex((el) => !el))

  const focusByIndex = (index: number) => {
    const input = rootRef.current?.querySelector<HTMLInputElement>(`input[name='input-${index}']`)
    input?.focus()
  }

  const onCardClick = (word: string) => () => {
    if (currentFocus === -1) return
    const nextValue = { ...value, [currentFocus]: word }
    const nextFocus = Object.values(nextValue).findIndex((el) => !el)
    setCurrentFocus(nextFocus)
    focusByIndex(nextFocus)
    handleChange(nextValue)
  }
  const onRemoveClick = (index: number) => () => {
    handleChange({ ...value, [index]: '' })
    setCurrentFocus(index)
    focusByIndex(index)
  }
  const onInputFocus = (index: number) => () => setCurrentFocus(index)

  useEffect(() => {
    focusByIndex(currentFocus)
    const editable: (number | null)[] = Object.values(value)
      .map((el, i) => (!el ? i : null))
      .filter((el) => el !== null)
    setEditableCells(editable)
  }, [])
  return (
    <>
      <Wrapper ref={rootRef}>
        {phrase.map((_, index) => (
          <Item key={index}>
            <Num>{index + 1}</Num>
            <PhraseInput
              value={value?.[index]}
              name={`input-${index}`}
              onFocus={onInputFocus(index)}
            />
            {value?.[index] && editableCells.includes(index) && (
              <Closable onClick={onRemoveClick(index)}>&times;</Closable>
            )}
          </Item>
        ))}
      </Wrapper>
      <DNDContainer>
        {phrase.map((el) => (
          <DNDItem onClick={onCardClick(el)} $disabled={Object.values(value).includes(el)} key={el}>
            {el}
          </DNDItem>
        ))}
      </DNDContainer>
    </>
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

const Closable = styled.div`
  position: absolute;
  right: 14px;
  top: -4px;
  font-size: 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.blue};
`
const PhraseInput = styled(Input)`
  width: 90%;
  text-align: center;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0;
  outline: none;
  /* pointer-events: none; */
  box-shadow: unset !important;
`

const DNDContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  padding-top: 20px;
  margin-top: 40px;
  margin-bottom: 20px;
`

const DNDItem = styled.div<{ $disabled?: boolean }>`
  width: 10%;
  color: #000;
  font-size: 10px;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  ${({ $disabled }) => $disabled && ` opacity: 0.5; pointer-events: none;`}
`

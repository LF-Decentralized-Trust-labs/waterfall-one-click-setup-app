import React, { PropsWithChildren } from 'react'
import { Card } from 'antd'
import { styled } from 'styled-components'
import { ButtonPrimary } from '@renderer/ui-kit/Button'

type FormPropsT = PropsWithChildren & {
  title: string
  goNext?: () => void
  goPrev?: () => void
  canGoNext?: boolean
}

export const NodeAddForm: React.FC<FormPropsT> = ({
  children,
  canGoNext = true,
  goNext,
  goPrev,
  title
}) => {
  return (
    <StyledCard type="inner" title={title}>
      <Body>{children}</Body>
      <Actions>
        <ButtonPrimary onClick={goPrev} ghost={!goPrev} disabled={!goPrev}>
          Back
        </ButtonPrimary>
        <ButtonPrimary onClick={goNext} disabled={!canGoNext} ghost={!canGoNext}>
          Next
        </ButtonPrimary>
      </Actions>
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  margin-top: 40px;
`

const Body = styled.div`
  padding-top: 20px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;
`

import React, { PropsWithChildren } from 'react'
import { Card } from 'antd'
import { styled } from 'styled-components'
import { ButtonPrimary } from '@renderer/ui-kit/Button'

type FormPropsT = PropsWithChildren & {
  title: string
  goNext?: () => void
  goPrev?: () => void
  canGoNext?: boolean
  goNextTitle?: string
  goPrevTitle?: string
  isLoading?: boolean
}

export const NodeAddForm: React.FC<FormPropsT> = ({
  children,
  canGoNext = true,
  goNext,
  goPrev,
  goNextTitle = 'Next',
  goPrevTitle = 'Back',
  isLoading
}) => {
  return (
    <StyledCard type="inner">
      <Body>{children}</Body>
      <Actions>
        <ButtonPrimary onClick={goPrev} ghost={!goPrev} disabled={!goPrev}>
          {goPrevTitle}
        </ButtonPrimary>
        <ButtonPrimary onClick={goNext} disabled={!canGoNext} ghost={!canGoNext} loading={isLoading ? isLoading : false}>
          {goNextTitle}
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

import React, { PropsWithChildren } from 'react'
import { Card } from 'antd'
import { styled } from 'styled-components'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { Alert } from '@renderer/ui-kit/Alert'

type FormPropsT = PropsWithChildren & {
  title?: string
  goNext?: () => void
  goPrev?: () => void
  canGoNext?: boolean
  extra?: React.ReactNode
  nextText?: string
  isLoading?: boolean
  error?: string
}

export const AddWorkerForm: React.FC<FormPropsT> = ({
  children,
  canGoNext = true,
  goNext,
  goPrev,
  title,
  extra,
  nextText = 'Next',
  isLoading,
  error
}) => {
  return (
    <StyledCard type="inner" title={title} extra={extra}>
      <Body>{children}</Body>
      {error && <Alert type="error" message={error} />}
      <Actions>
        <ButtonPrimary onClick={goPrev} ghost={!goPrev} disabled={!goPrev}>
          Back
        </ButtonPrimary>
        <ButtonPrimary
          onClick={goNext}
          disabled={!canGoNext}
          ghost={!canGoNext}
          loading={isLoading ? isLoading : false}
        >
          {nextText}
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

import { ArrowedButton } from '@renderer/ui-kit/Button'
import { Title } from '@renderer/ui-kit/Typography'
import React from 'react'
import { styled } from 'styled-components'

type PageHeaderPropsT = {
  title: string
  goBack?: () => void
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderPropsT> = ({ title, goBack, actions }) => {
  return (
    <Wrapper>
      <GoBack>{goBack && <ArrowedButton direction="back" onClick={goBack} />}</GoBack>
      <Title>{title}</Title>
      {actions && <Actions>{actions}</Actions>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 30px 30px 30px 5px;

  position: relative;
`

const GoBack = styled.div`
  width: 60px;
`

const Actions = styled.div`
  position: absolute;
  right: 30px;
`

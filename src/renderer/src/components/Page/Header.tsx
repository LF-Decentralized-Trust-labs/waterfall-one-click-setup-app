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
      {goBack && (
        <GoBack>
          <ArrowedButton direction="back" onClick={goBack} />
        </GoBack>
      )}
      <PageTitle level={3}>{title}</PageTitle>
      {actions && <Actions>{actions}</Actions>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 40px 30px 40px;

  position: relative;
`

const GoBack = styled.div`
  width: 60px;
`

const Actions = styled.div`
  position: absolute;
  right: 14px;
  display: flex;
`

const PageTitle = styled(Title)`
  margin: 0 !important;
  padding: 0 !important;
  font-weight: 400;
`

import React, { PropsWithChildren } from 'react'
import { Layout } from 'antd'
import { styled } from 'styled-components'
const { Content } = Layout

type PageContentProps = PropsWithChildren

export const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return <StyledContent>{children}</StyledContent>
}

const StyledContent = styled(Content)`
  .ant-layout {
    background-color: ${({ theme }) => theme.palette.layout.white};
    height: 100%;
  }
`

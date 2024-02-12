import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'

type LayoutProps = PropsWithChildren

export const LayoutWrapper: React.FC<LayoutProps> = ({ children }) => {
  return <StyledLayout>{children}</StyledLayout>
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`

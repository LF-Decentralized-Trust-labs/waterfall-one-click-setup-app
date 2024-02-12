import React, { PropsWithChildren } from 'react'
import { Layout } from 'antd'
import { styled } from 'styled-components'
const { Sider } = Layout

type AppSideBarProps = PropsWithChildren

export const AppSideBar: React.FC<AppSideBarProps> = ({ children }) => {
  return <StyledSider>{children}</StyledSider>
}

const StyledSider = styled(Sider)`
  display: flex;
  justify-content: center;
  background-color: ${({theme}) => theme.palette.background.gray} !important;
  min-width: 200px !important;
  .ant-layout-sider-children {
    width: 100%;
  }
`

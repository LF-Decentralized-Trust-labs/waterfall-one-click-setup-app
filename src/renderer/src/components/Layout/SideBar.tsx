/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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
  background-color: ${({ theme }) => theme.palette.background.gray} !important;
  min-width: 200px !important;
  .ant-layout-sider-children {
    width: 100%;
  }
`

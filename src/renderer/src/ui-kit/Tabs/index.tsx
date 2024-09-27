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
import { Tabs as AntdTabs, Flex, TabsProps } from 'antd'
import React, { PropsWithChildren } from 'react'
import { styled } from 'styled-components'
import { Text } from '../Typography'

export const Tabs: React.FC<TabsProps> = ({ ...props }) => {
  return (
    <TabsWrapper>
      <StyledTabs {...props} />
    </TabsWrapper>
  )
}

export const TabContent: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  return <TabContentWrapper {...props}>{children}</TabContentWrapper>
}

export const TabTextRow: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({
  label,
  value
}) => {
  return (
    <TextItem gap={6} align="center">
      <Text>{label}:</Text>
      <Text>{value}</Text>
    </TextItem>
  )
}
export const TabTextColumn: React.FC<{
  label: string
  value?: string | number | React.ReactNode
}> = ({ label, value }) => {
  return (
    <TextItem gap={4} vertical>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </TextItem>
  )
}

const TabsWrapper = styled.div`
  .ant-tabs-nav-add {
    display: none;
  }
  .ant-tabs-nav {
    margin-bottom: 0 !important;
  }
`

const StyledTabs = styled(AntdTabs)``

const TabContentWrapper = styled.div`
  padding: 30px 30px 15px 5px;
  /* border: 1px solid ${({ theme }) => theme.palette.background.gray}; */

  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`

const TextItem = styled(Flex)`
  margin-bottom: 20px;
`

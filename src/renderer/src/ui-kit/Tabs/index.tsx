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

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
      <Text strong>{label}:</Text>
      <Text>{value}</Text>
    </TextItem>
  )
}
export const TabTextColumn: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({
  label,
  value
}) => {
  return (
    <TextItem gap={4} vertical>
      <Text strong>{label}</Text>
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
    background: rgba(0, 0, 0, 0.02);
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }
  .ant-tabs-tab {
    background-color: #f6f6f6 !important;
  }
  .ant-tabs-tab-active {
    background-color: #ffffff !important;
    border-bottom-color: transparent;
  }
`

const StyledTabs = styled(AntdTabs)``

const TabContentWrapper = styled.div`
  padding: 30px 30px 15px 30px;
  border: 1px solid ${({ theme }) => theme.palette.background.gray};

  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`

const TextItem = styled(Flex)`
  margin-bottom: 8px;
`

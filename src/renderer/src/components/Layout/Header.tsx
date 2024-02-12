import React from 'react'
import styled from 'styled-components'
import { Layout, Flex } from 'antd'
import LogoSrc from '@renderer/ui-kit/assets/logo.svg'
import { LayoutHeaderActionT } from '@renderer/types/layout'
import { IconButton } from '@renderer/ui-kit/Button'
import { Text } from '@renderer/ui-kit/Typography'

type HeaderComponentPropsT = {
  title: string
  rightActions?: LayoutHeaderActionT[]
}

export const HeaderComponent: React.FC<HeaderComponentPropsT> = ({ title, rightActions }) => {
  return (
    <AppHeader>
      <DummyNativeActions />
      <Flex align={'center'}>
        <AppLogo />
        <AppTitle>{title}</AppTitle>
      </Flex>
      <Flex justify={'space-between'} align={'center'} flex={0.1}>
        {rightActions?.map((el) => <IconButton icon={el.icon} key={el.key} onClick={el.onClick} />)}
      </Flex>
    </AppHeader>
  )
}

const AppHeader = styled(Layout.Header)`
  height: 40px;
  background-color: #1677ff;
  padding: 0;
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`

const AppTitle = styled(Text)`
  color: ${({ theme }) => theme.palette.text.white};
  padding: 0 8px;
`
const AppLogo = styled.img.attrs({ src: LogoSrc, width: 24, height: 24 })``

const DummyNativeActions = styled.div`
  width: 80px;
`

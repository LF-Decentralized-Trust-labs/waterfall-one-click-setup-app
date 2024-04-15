import { HeaderComponent } from '@renderer/components/Layout/Header'
import {
  SettingOutlined,
  ReadOutlined,
  HomeOutlined,
  BellOutlined,
  PoweroffOutlined
} from '@ant-design/icons'
import { useNavigation } from '../../hooks/navigation'
import { routes } from '../../constants/navigation'
import React from 'react'
import { styled } from 'styled-components'
import { APP_TITLE } from '../../constants/env'

type RightActionsType = {
  key: string
  to: string
  icon: React.ReactNode
}
const RightActions: RightActionsType[] = [
  { key: 'home', to: 'https://waterfall.network', icon: <HomeOutlined /> },
  { key: 'docs', to: 'https://docs.waterfall.network', icon: <ReadOutlined /> },
  { key: 'settings', to: routes.settings, icon: <SettingOutlined /> },
  { key: 'notification', to: routes.notifications, icon: <BellOutlined /> }
]

export const Header = () => {
  const { goRoute, goBrowser, quit } = useNavigation()
  let rightActions = RightActions.map((el) => ({
    ...el,
    onClick: () => {
      if (el.to.search('http') > -1) {
        return goBrowser(el.to)
      }
      return goRoute(el.to)
    }
  }))
  rightActions = rightActions.concat([
    { key: 'quit', onClick: () => quit(), icon: <QuitIcon />, to: '' }
  ])

  return <HeaderComponent title={APP_TITLE} rightActions={rightActions} />
}

const QuitIcon = styled(PoweroffOutlined)`
  color: red;
`

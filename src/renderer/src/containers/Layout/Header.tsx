import { HeaderComponent } from '@renderer/components/Layout/Header'
import { SettingOutlined, ReadOutlined, HomeOutlined, BellOutlined } from '@ant-design/icons'
import { useNavigation } from '../../hooks/navigation'
import { routes } from '../../constants/navigation'
import React from 'react'

const APP_TITLE = 'Waterfall App'

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
  const { goRoute, goBrowser } = useNavigation()
  const rightActions = RightActions.map((el) => ({
    ...el,
    onClick: () => {
      if (el.to.search('http') > -1) {
        return goBrowser(el.to)
      }
      return goRoute(el.to)
    }
  }))
  return <HeaderComponent title={APP_TITLE} rightActions={rightActions} />
}

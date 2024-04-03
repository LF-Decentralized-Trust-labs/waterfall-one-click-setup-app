import { HeaderComponent } from '@renderer/components/Layout/Header'
import { LayoutHeaderActionT } from '@renderer/types/layout'
import { SettingOutlined, FileOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons'

const APP_TITLE = 'Waterfall Node App'

const RightActions: LayoutHeaderActionT[] = [
  { key: 'home', onClick: () => {alert('home')}, icon: <HomeOutlined /> },
  { key: 'file', onClick: () => {alert('file')}, icon: <FileOutlined /> },
  { key: 'settings', onClick: () => {alert('settings')}, icon: <SettingOutlined /> },
  { key: 'info', onClick: () => {alert('info')}, icon: <InfoCircleOutlined /> }
]

export const Header = () => {
  return <HeaderComponent title={APP_TITLE} rightActions={RightActions} />
}

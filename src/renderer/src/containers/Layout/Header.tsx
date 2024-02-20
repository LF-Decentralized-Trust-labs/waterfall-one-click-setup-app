import { HeaderComponent } from '@renderer/components/Layout/Header'
import { LayoutHeaderActionT } from '@renderer/types/layout'
import { SettingOutlined, FileOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons'

const APP_TITLE = 'Waterfall Node App'

const RightActions: LayoutHeaderActionT[] = [
  { key: 'home', onClick: () => {}, icon: <HomeOutlined /> },
  { key: 'file', onClick: () => {}, icon: <FileOutlined /> },
  { key: 'settings', onClick: () => {}, icon: <SettingOutlined /> },
  { key: 'info', onClick: () => {}, icon: <InfoCircleOutlined /> }
]

export const Header = () => {
  return <HeaderComponent title={APP_TITLE} rightActions={RightActions} />
}

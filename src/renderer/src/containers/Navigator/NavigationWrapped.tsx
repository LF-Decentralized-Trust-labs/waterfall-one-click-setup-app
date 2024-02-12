import { PageContent } from '@renderer/components/Layout/PageContent'
import { AppSideBar } from '@renderer/components/Layout/SideBar'
import { Menu } from '@renderer/components/Menu'
import { root_routes, routes } from '@renderer/constants/navigation'
import { MenuItemT } from '@renderer/types/navigation'
import { PropsWithChildren } from 'react'
import { NodeIndexOutlined, RobotOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

const menuItems: MenuItemT[] = [
  { link: routes.nodes.list, key: root_routes.nodes, icon: <NodeIndexOutlined />, title: 'Nodes' },
  { link: routes.workers.list, key: root_routes.workers, icon: <RobotOutlined />, title: 'Workers' },
  {
    link: routes.statistics.view,
    key: root_routes.statistics,
    icon: <UnorderedListOutlined />,
    title: 'Statistics'
  }
]

export const PageRender: React.FC<PropsWithChildren> = ({ children }) => {
  const {pathname} = useLocation();
  const active_root_key = pathname.split('/')?.[1];

  return (
    <>
      <AppSideBar>
        <Menu menuItems={menuItems} active={active_root_key} />
      </AppSideBar>
      <PageContent>{children}</PageContent>
    </>
  )
}

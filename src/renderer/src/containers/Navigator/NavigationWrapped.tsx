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
  {
    link: routes.workers.list,
    key: root_routes.workers,
    icon: <RobotOutlined />,
    title: 'Validators'
  },
  {
    link: routes.statistics.view,
    key: root_routes.statistics,
    icon: <UnorderedListOutlined />,
    title: 'Statistics'
  }
]

export const PageRender: React.FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation()
  const active_root_key = pathname.split('/')?.[1]

  return (
    <>
      <AppSideBar>
        <Menu menuItems={menuItems} active={active_root_key} />
      </AppSideBar>
      <PageContent>{children}</PageContent>
    </>
  )
}

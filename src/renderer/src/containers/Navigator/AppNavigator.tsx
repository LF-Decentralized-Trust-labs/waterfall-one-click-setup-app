import React from 'react'
import { PageContent } from '@renderer/components/Layout/PageContent'
import { AppSideBar } from '@renderer/components/Layout/SideBar'
import { NodeListPage } from '@renderer/pages/NodesList'

export const AppNavigator = () => {
  return (
    <>
      <AppSideBar>MENU</AppSideBar>
      <PageContent>
        <NodeListPage />
      </PageContent>
    </>
  )
}

import { NodeViewTabProps } from '@renderer/types/node'
import React from 'react'
import { Layout } from 'antd'
import { Content } from '../../components/ComingSoon/Content'
import { TabContent } from '@renderer/ui-kit/Tabs'

export const NodeViewStatistics: React.FC<NodeViewTabProps> = () => {
  return (
    <TabContent>
      <Layout>
        <Content />
      </Layout>
    </TabContent>
  )
}

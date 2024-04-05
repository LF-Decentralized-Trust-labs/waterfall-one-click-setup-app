import React from 'react'
import { WorkerViewTabProps } from '@renderer/types/workers'
import { Layout } from 'antd'
import { Content } from '../../components/ComingSoon/Content'
import { TabContent } from '@renderer/ui-kit/Tabs'

export const WorkerViewStatistics: React.FC<WorkerViewTabProps> = () => {
  return (
    <TabContent>
      <Layout>
        <Content />
      </Layout>
    </TabContent>
  )
}

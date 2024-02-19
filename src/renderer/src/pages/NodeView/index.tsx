import React, { useMemo, useState } from 'react'
import { PageBody } from '@renderer/components/Page/Body'
import { PageHeader } from '@renderer/components/Page/Header'
import { Flex, Layout } from 'antd'
import { IconButton } from '@renderer/ui-kit/Button'
import { PauseOutlined, CaretRightOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Tabs } from '@renderer/ui-kit/Tabs'
import { NodeViewInformation } from '@renderer/containers/Node/NodeViewInformation'
import { NodeViewCoordinator } from '@renderer/containers/Node/NodeViewCoordinator'
import { NodeViewValidator } from '@renderer/containers/Node/NodeViewValidator'
import { NodeViewWorkers } from '@renderer/containers/Node/NodeViewWorkers'
import { NodeViewStatistics } from '@renderer/containers/Node/NodeViewStatistics'

const getTabs = (id?: string) => [
  {
    label: 'Main Information',
    children: <NodeViewInformation id={id} />,
    key: '1',
    closable: false
  },
  {
    label: 'Coordinator',
    children: <NodeViewCoordinator id={id} />,
    key: '2',
    closable: false
  },
  {
    label: 'Validator',
    children: <NodeViewValidator id={id} />,
    key: '3',
    closable: false
  },
  {
    label: 'Workers',
    children: <NodeViewWorkers id={id} />,
    key: '4',
    closable: false
  },
  {
    label: 'Statistics',
    children: <NodeViewStatistics id={id} />,
    key: '5',
    closable: false
  }
]

export const NodeViewPage = () => {
  const nodeId = useParams()?.id
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  const tabs = useMemo(() => getTabs(nodeId), [nodeId])
  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const onTabChange = (newActiveKey: string) => setActiveKey(newActiveKey)

  return (
    <Layout>
      <PageHeader
        goBack={goBack}
        title={`Node ${nodeId}`}
        actions={
          <Flex dir="row" gap={6}>
            <IconButton icon={<PauseOutlined />} shape="default" size="middle" />
            <IconButton icon={<CaretRightOutlined />} shape="default" size="middle" />
            <IconButton icon={<ReloadOutlined />} shape="default" size="middle" />
          </Flex>
        }
      />
      <PageBody>
        <Tabs type="editable-card" items={tabs} onChange={onTabChange} activeKey={activeKey} />
      </PageBody>
    </Layout>
  )
}

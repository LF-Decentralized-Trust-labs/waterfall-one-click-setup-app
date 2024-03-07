import { useMemo, useState } from 'react'
import { PageBody } from '@renderer/components/Page/Body'
import { PageHeader } from '@renderer/components/Page/Header'
import { Flex, Layout } from 'antd'
import { IconButton } from '@renderer/ui-kit/Button'
import { PauseOutlined, CaretRightOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Tabs } from '@renderer/ui-kit/Tabs'
import { Alert } from '@renderer/ui-kit/Alert'
import { NodeViewInformation } from '@renderer/containers/Node/NodeViewInformation'
import { NodeViewCoordinator } from '@renderer/containers/Node/NodeViewCoordinator'
import { NodeViewValidator } from '@renderer/containers/Node/NodeViewValidator'
import { NodeViewWorkers } from '@renderer/containers/Node/NodeViewWorkers'
import { NodeViewStatistics } from '@renderer/containers/Node/NodeViewStatistics'
import { useGetById } from '@renderer/hooks/node'
import { Node } from '@renderer/types/node'

const getTabs = (node?: Node) => [
  {
    label: 'Main Information',
    children: <NodeViewInformation item={node} />,
    key: '1',
    closable: false
  },
  {
    label: 'Coordinator',
    children: <NodeViewCoordinator item={node} />,
    key: '2',
    closable: false
  },
  {
    label: 'Validator',
    children: <NodeViewValidator item={node} />,
    key: '3',
    closable: false
  },
  {
    label: 'Workers',
    children: <NodeViewWorkers item={node} />,
    key: '4',
    closable: false
  },
  {
    label: 'Statistics',
    children: <NodeViewStatistics item={node} />,
    key: '5',
    closable: false
  }
]

export const NodeViewPage = () => {
  const nodeId = useParams()?.id
  const navigate = useNavigate()
  const { isLoading, data: node, error } = useGetById(nodeId)
  const goBack = () => navigate(-1)

  const tabs = useMemo(() => getTabs(node), [node])
  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const onTabChange = (newActiveKey: string) => setActiveKey(newActiveKey)

  return (
    <Layout>
      <PageHeader
        goBack={goBack}
        title={node ? node.name : `Node #${nodeId}`}
        actions={
          <Flex dir="row" gap={6}>
            <IconButton icon={<PauseOutlined />} shape="default" size="middle" />
            <IconButton icon={<CaretRightOutlined />} shape="default" size="middle" />
            <IconButton icon={<ReloadOutlined />} shape="default" size="middle" />
          </Flex>
        }
      />
      <PageBody isLoading={isLoading}>
        {error && <Alert message={error.message} type="error" />}
        <Tabs items={tabs} onChange={onTabChange} activeKey={activeKey} />
      </PageBody>
    </Layout>
  )
}

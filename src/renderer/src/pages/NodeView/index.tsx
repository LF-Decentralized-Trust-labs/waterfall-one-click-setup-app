import { useMemo, useState } from 'react'
import { PageBody } from '@renderer/components/Page/Body'
import { PageHeader } from '@renderer/components/Page/Header'
import { Flex, Layout } from 'antd'
import { IconButton } from '@renderer/ui-kit/Button'
import { PauseOutlined, CaretRightOutlined, ReloadOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { Tabs } from '@renderer/ui-kit/Tabs'
import { Alert } from '@renderer/ui-kit/Alert'
import { NodeViewInformation } from '@renderer/containers/Node/NodeViewInformation'
import { NodeViewCoordinator } from '@renderer/containers/Node/NodeViewCoordinator'
import { NodeViewValidator } from '@renderer/containers/Node/NodeViewValidator'
import { NodeViewWorkers } from '@renderer/containers/Node/NodeViewWorkers'
import { NodeViewStatistics } from '@renderer/containers/Node/NodeViewStatistics'
import { useGetById, useControl } from '@renderer/hooks/node'
import { Node, Status } from '@renderer/types/node'
import { getNodeStatus } from '@renderer/helpers/node'
import { getViewLink } from '@renderer/helpers/navigation'
import { routes } from '@renderer/constants/navigation'

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
  const { isLoading, data: node, error } = useGetById(nodeId, { refetchInterval: 1000 })
  const { onStop, onRestart, onStart, status } = useControl(nodeId)

  const tabs = useMemo(() => getTabs(node), [node])
  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const onTabChange = (newActiveKey: string) => setActiveKey(newActiveKey)

  const breadcrumb = [
    {
      title: 'Nodes',
      link: getViewLink(routes.nodes.list)
    },
    {
      title: node ? node.name : `Node #${nodeId}`
    }
  ]

  return (
    <Layout>
      <PageHeader
        breadcrumb={breadcrumb}
        actions={
          <Flex dir="row" gap={6}>
            {node && getNodeStatus(node) !== Status.stopped && (
              <IconButton icon={<PauseOutlined />} shape="default" size="middle" onClick={onStop} loading={status ? status === 'stop' : false}/>
            )}
            {node && getNodeStatus(node) === Status.stopped && (
              <IconButton
                icon={<CaretRightOutlined />}
                shape="default"
                size="middle"
                onClick={onStart}
                loading={status ? status === 'start' : false}
              />
            )}

            <IconButton
              icon={<ReloadOutlined />}
              shape="default"
              size="middle"
              onClick={onRestart}
              loading={status ? status === 'restart' : false}
            />
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

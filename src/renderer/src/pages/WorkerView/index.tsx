import { useMemo, useState } from 'react'
import { PageBody } from '@renderer/components/Page/Body'
import { PageHeader } from '@renderer/components/Page/Header'
import { Flex, Layout, Popover } from 'antd'
import { IconButton } from '@renderer/ui-kit/Button'
import { CloseOutlined, CaretRightOutlined, WalletOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Tabs } from '@renderer/ui-kit/Tabs'
import { WorkerViewStatistics } from '@renderer/containers/Workers/WorkerViewStatistics'
import { WorkerViewValidator } from '@renderer/containers/Workers/WorkerViewValidator'
import { WorkerViewCoordinator } from '@renderer/containers/Workers/WorkerViewCoordinator'
import { WorkerViewInformation } from '@renderer/containers/Workers/WorkerViewInformation'

const getTabs = (id?: string) => [
  {
    label: 'Main Information',
    children: <WorkerViewInformation id={id} />,
    key: '1',
    closable: false
  },
  {
    label: 'Coordinator',
    children: <WorkerViewCoordinator id={id} />,
    key: '2',
    closable: false
  },
  {
    label: 'Validator',
    children: <WorkerViewValidator id={id} />,
    key: '3',
    closable: false
  },
  {
    label: 'Statistics',
    children: <WorkerViewStatistics id={id} />,
    key: '4',
    closable: false
  }
]

export const WorkerViewPage = () => {
  const workerId = useParams()?.id
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  const tabs = useMemo(() => getTabs(workerId), [workerId])
  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const onTabChange = (newActiveKey: string) => setActiveKey(newActiveKey)

  return (
    <Layout>
      <PageHeader
        goBack={goBack}
        title={`Worker ${workerId}`}
        actions={
          <Flex dir="row" gap={6}>
            <Popover content="Activate" placement="bottom">
              <IconButton icon={<CaretRightOutlined />} shape="default" size="middle" />
            </Popover>
            <Popover content="Deactivate" placement="bottom">
              <IconButton icon={<CloseOutlined />} shape="default" size="middle" />
            </Popover>
            <Popover content="Withdraw" placement="bottom">
              <IconButton icon={<WalletOutlined />} shape="default" size="middle" />
            </Popover>
          </Flex>
        }
      />
      <PageBody>
        <Tabs items={tabs} onChange={onTabChange} activeKey={activeKey} />
      </PageBody>
    </Layout>
  )
}

import { PageHeader } from '@renderer/components/Page/Header'
import { Layout } from 'antd'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { PlusCircleOutlined } from '@ant-design/icons'
import { PageBody } from '@renderer/components/Page/Body'
import { WorkersList } from '@renderer/containers/Workers/WorkersList'
import { WorkersT } from '@renderer/types/workers'
import { routes } from '@renderer/constants/navigation'

const data: WorkersT[] = [
  {
    id: '1',
    node: 'test',
    status: 'Active',
    workedHours: 20,
    depositData: null
  },
  {
    id: '2',
    node: 'Node Test 2',
    status: 'Active',
    workedHours: 100,
    depositData: true
  }
]

export const WorkersListPage = () => {
  const shouldAddNode = false
  return (
    <Layout>
      <PageHeader
        title="Workers"
        actions={
          shouldAddNode ? null : !data?.length ? (
            <ButtonPrimary href={routes.workers.import}>
              Import
              <PlusCircleOutlined />
            </ButtonPrimary>
          ) : (
            <ButtonPrimary href={routes.workers.add}>
              Add Worker
              <PlusCircleOutlined />
            </ButtonPrimary>
          )
        }
      />
      <PageBody>
        <WorkersList shouldAddNode={shouldAddNode} data={data} />
      </PageBody>
    </Layout>
  )
}

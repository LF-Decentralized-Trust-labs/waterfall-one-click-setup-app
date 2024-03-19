import { PageHeader } from '@renderer/components/Page/Header'
import { Layout } from 'antd'
import { Alert } from '@renderer/ui-kit/Alert'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { PlusCircleOutlined } from '@ant-design/icons'
import { PageBody } from '@renderer/components/Page/Body'
import { WorkersList } from '@renderer/containers/Workers/WorkersList'
import { routes } from '@renderer/constants/navigation'
import { useGetAll } from '@renderer/hooks/workers'

export const WorkersListPage = () => {
  const { isLoading, data, error } = useGetAll({ refetchInterval: 5000 })

  const breadcrumb = [
    {
      title: 'Workers'
    }
  ]

  const shouldAddNode = false
  return (
    <Layout>
      <PageHeader
        breadcrumb={breadcrumb}
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
      <PageBody isLoading={isLoading}>
        {error && <Alert message={error.message} type="error" />}
        <WorkersList shouldAddNode={shouldAddNode} data={data} />
      </PageBody>
    </Layout>
  )
}

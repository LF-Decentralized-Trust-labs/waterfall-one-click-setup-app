import { PageHeader } from '@renderer/components/Page/Header'
import { Layout } from 'antd'
import { Alert } from '@renderer/ui-kit/Alert'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { PlusCircleOutlined } from '@ant-design/icons'
import { PageBody } from '@renderer/components/Page/Body'
import { WorkersList } from '@renderer/containers/Workers/WorkersList'
import { routes } from '@renderer/constants/navigation'
import { useGetAll } from '@renderer/hooks/workers'
import { useGetAll as useGetAllNode  } from '@renderer/hooks/node'

export const WorkersListPage = () => {
  const { isLoading, data, error } = useGetAll({ refetchInterval: 5000 })
  const { data : nodes }  = useGetAllNode()

  const breadcrumb = [
    {
      title: 'Workers'
    }
  ]

  return (
    <Layout>
      <PageHeader
        breadcrumb={breadcrumb}
        actions={
          //  !data?.length ? (
          //   <ButtonPrimary href={routes.workers.import}>
          //     Import
          //     <PlusCircleOutlined />
          //   </ButtonPrimary>
          // ) : (
          nodes && nodes.length > 0 && (
            <ButtonPrimary href={routes.workers.add}>
              Add Worker
              <PlusCircleOutlined />
            </ButtonPrimary>
          )
        }
      />
      <PageBody isLoading={isLoading}>
        {error && <Alert message={error.message} type="error" />}
        <WorkersList shouldAddNode={nodes && nodes.length === 0} data={data} />
      </PageBody>
    </Layout>
  )
}

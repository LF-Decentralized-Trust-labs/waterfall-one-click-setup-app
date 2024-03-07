import { PageHeader } from '@renderer/components/Page/Header'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { Alert } from '@renderer/ui-kit/Alert'
import { Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { NodesList } from '@renderer/containers/Node/NodesList'
import { PageBody } from '@renderer/components/Page/Body'
import { routes } from '@renderer/constants/navigation'

import { useGetAll, useGoNode } from '@renderer/hooks/node'

export const NodeListPage = () => {
  const { isLoading, data, error } = useGetAll()
  const { goView } = useGoNode()
  return (
    <Layout>
      <PageHeader
        title="Nodes"
        actions={
          <ButtonPrimary href={routes.nodes.create}>
            Add <PlusCircleOutlined />
          </ButtonPrimary>
        }
      />
      <PageBody isLoading={isLoading}>
        {error && <Alert message={error.message} type="error" />}
        <NodesList data={data} onRowClick={goView} />
      </PageBody>
    </Layout>
  )
}

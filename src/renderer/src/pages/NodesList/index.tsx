import { PageHeader } from '@renderer/components/Page/Header'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { NodesList } from '@renderer/containers/Node/NodesList'
import { PageBody } from '@renderer/components/Page/Body'

export const NodeListPage = () => {
  return (
    <Layout>
      <PageHeader
        title="Nodes"
        actions={
          <ButtonPrimary>
            Add <PlusCircleOutlined />
          </ButtonPrimary>
        }
      />
      <PageBody>
        <NodesList />
      </PageBody>
    </Layout>
  )
}

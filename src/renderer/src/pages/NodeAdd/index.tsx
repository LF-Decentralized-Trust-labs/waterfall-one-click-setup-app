import { PageBody } from '@renderer/components/Page/Body'
import { PageHeader } from '@renderer/components/Page/Header'
import { AddNode } from '@renderer/containers/Node/AddNode'
import { Layout } from 'antd'

export const AddNodePage = () => {
  return (
    <Layout>
      <PageHeader title="Add Node" />
      <PageBody>
        <AddNode />
      </PageBody>
    </Layout>
  )
}

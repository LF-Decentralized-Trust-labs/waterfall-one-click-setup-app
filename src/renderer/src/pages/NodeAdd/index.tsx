import { PageHeader } from '@renderer/components/Page/Header'
import { ArrowedButton } from '@renderer/ui-kit/Button'
import { Flex, Layout } from 'antd'

export const AddNodePage = () => {
  return (
    <Layout>
      <PageHeader
        title="Add Node"
        actions={
          <Flex align="center" gap={4}>
            <ArrowedButton direction="back" />
            <ArrowedButton direction="forward" />
          </Flex>
        }
      />
    </Layout>
  )
}

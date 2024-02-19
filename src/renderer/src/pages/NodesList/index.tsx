import { PageHeader } from '@renderer/components/Page/Header'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { Layout } from 'antd'
import { PlusCircleOutlined, PauseCircleOutlined, PlayCircleOutlined} from '@ant-design/icons'
import { start, stop} from '@renderer/api/node'

export const NodeListPage = () => {
  return (
    <Layout>
      <PageHeader
        title="Nodes"
        actions={
          <>
            <ButtonPrimary onClick={start}>
              Start <PlayCircleOutlined />
            </ButtonPrimary>
            <ButtonPrimary onClick={stop}>
              Stop <PauseCircleOutlined />
            </ButtonPrimary>
            <ButtonPrimary>
              Add <PlusCircleOutlined />
            </ButtonPrimary>
          </>
        }
      />
    </Layout>
  )
}

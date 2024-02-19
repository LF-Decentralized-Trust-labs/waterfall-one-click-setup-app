import { PageHeader } from '@renderer/components/Page/Header'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { Layout } from 'antd'
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { start, stop } from '@renderer/api/node'

export const DraftPage = () => {
  return (
    <Layout>
      <PageHeader
        title="Draft"
        actions={
          <>
            <ButtonPrimary onClick={start}>
              Start <PlayCircleOutlined />
            </ButtonPrimary>
            <ButtonPrimary onClick={stop}>
              Stop <PauseCircleOutlined />
            </ButtonPrimary>
          </>
        }
      />
    </Layout>
  )
}

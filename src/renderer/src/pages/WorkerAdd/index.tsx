import { SearchKeys } from '@renderer/constants/navigation'
import { useSearchParams } from 'react-router-dom'
import { Layout } from 'antd'
import { PageHeader } from '@renderer/components/Page/Header'
import { PageBody } from '@renderer/components/Page/Body'
import { AddWorker } from '@renderer/containers/Workers/AddWorker'

export const AddWorkerPage = () => {
  const [searchParams] = useSearchParams()
  const fromMode = searchParams.get(SearchKeys.mode)

  const mode = fromMode === 'import' ? 'import' : 'add'

  return (
    <Layout>
      <PageHeader title={mode === 'add' ? 'Add Validator' : 'Import Validator'} />
      <PageBody>
        <AddWorker mode={mode} />
      </PageBody>
    </Layout>
  )
}

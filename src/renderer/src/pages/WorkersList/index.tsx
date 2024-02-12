import React from 'react'
import { PageHeader } from '@renderer/components/Page/Header'
import { Layout } from 'antd'
import { ButtonPrimary } from '@renderer/ui-kit/Button'

export const WorkersListPage = () => {
  return (
    <Layout>
      <PageHeader title="Workers" actions={<ButtonPrimary>Import Workers</ButtonPrimary>} />
    </Layout>
  )
}

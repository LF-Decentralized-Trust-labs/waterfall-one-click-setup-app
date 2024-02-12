import React from 'react'
import { PageHeader } from '@renderer/components/Page/Header'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

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
    </Layout>
  )
}

/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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
  const { isLoading, data, error } = useGetAll({ refetchInterval: 5000 })
  const { goView } = useGoNode()
  const breadcrumb = [
    {
      title: 'Nodes'
    }
  ]
  return (
    <Layout>
      <PageHeader
        breadcrumb={breadcrumb}
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

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
import { Flex, Layout } from 'antd'
import { Alert } from '@renderer/ui-kit/Alert'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { PlusCircleOutlined, ImportOutlined } from '@ant-design/icons'
import { PageBody } from '@renderer/components/Page/Body'
import { WorkersList } from '@renderer/containers/Workers/WorkersList'
import { routes } from '@renderer/constants/navigation'
import { useGetAll } from '@renderer/hooks/workers'
import { useGetAll as useGetAllNode } from '@renderer/hooks/node'
import { SearchKeys } from '../../constants/navigation'
import { addParams } from '@renderer/helpers/navigation'

export const WorkersListPage = () => {
  const { isLoading, data, error } = useGetAll({ refetchInterval: 5000 })
  const { data: nodes } = useGetAllNode()

  const breadcrumb = [
    {
      title: 'Validators'
    }
  ]

  return (
    <Layout>
      <PageHeader
        breadcrumb={breadcrumb}
        actions={
          <Flex align="center" gap={4}>
            {nodes && nodes?.find((node) => node.workersCount === 0) && (
              <ButtonPrimary
                href={addParams(routes.workers.add, {
                  [SearchKeys.mode]: 'import'
                })}
              >
                Import
                <ImportOutlined />
              </ButtonPrimary>
            )}
            {nodes && nodes.length > 0 && (
              <ButtonPrimary href={routes.workers.add}>
                Add
                <PlusCircleOutlined />
              </ButtonPrimary>
            )}
          </Flex>
        }
      />
      <PageBody isLoading={isLoading}>
        {error && <Alert message={error.message} type="error" />}
        <WorkersList shouldAddNode={nodes && nodes.length === 0} data={data} />
      </PageBody>
    </Layout>
  )
}

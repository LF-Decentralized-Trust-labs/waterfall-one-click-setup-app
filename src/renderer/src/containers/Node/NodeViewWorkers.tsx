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
import React from 'react'
import { NodeViewTabProps, Type as NodeType } from '@renderer/types/node'
import { TabContent } from '@renderer/ui-kit/Tabs'
import { Flex, Spin } from 'antd'
import { Alert } from '@renderer/ui-kit/Alert'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { addParams } from '@renderer/helpers/navigation'
import { routes } from '@renderer/constants/navigation'
import { WorkersList } from '@renderer/containers/Workers/WorkersList'
import { useGetAllByNodeId } from '../../hooks/workers'
import { styled } from 'styled-components'
import { SearchKeys } from '../../constants/navigation'

export const NodeViewWorkers: React.FC<NodeViewTabProps> = ({ item }) => {
  const { isLoading, data, error } = useGetAllByNodeId(item?.id.toString(), {
    refetchInterval: 5000
  })
  const shouldAddNode = false

  if (isLoading)
    return (
      <TabContent>
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </TabContent>
    )
  return (
    <TabContent>
      {item && (
        <Actions align="center" justify="flex-end" gap={10}>
          {(data?.length === 0 || item.type === NodeType.provider) && (
            <ButtonPrimary
              href={addParams(routes.workers.add, {
                [SearchKeys.node]: item?.id.toString(),
                [SearchKeys.mode]: 'import',
                [SearchKeys.step]: '1'
              })}
            >
              Import Validator
            </ButtonPrimary>
          )}

          {item.type === NodeType.local && (
            <ButtonPrimary
              href={addParams(routes.workers.add, {
                [SearchKeys.node]: item?.id.toString(),
                [SearchKeys.step]: '1'
              })}
            >
              Add Validator
            </ButtonPrimary>
          )}
        </Actions>
      )}
      {error && <Alert message={error.message} type="error" />}
      <WorkersList shouldAddNode={shouldAddNode} data={data} />
    </TabContent>
  )
}

const Actions = styled(Flex)`
  margin-bottom: 10px;
`

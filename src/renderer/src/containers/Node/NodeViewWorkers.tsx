import React from 'react'
import { NodeViewTabProps } from '@renderer/types/node'
import { TabContent } from '@renderer/ui-kit/Tabs'
import { Flex, Spin } from 'antd'
import { Alert } from '@renderer/ui-kit/Alert'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { addParams } from '@renderer/helpers/navigation'
import { routes } from '@renderer/constants/navigation'
import { WorkersList } from '@renderer/containers/Workers/WorkersList'
import { useGetAllByNodeId } from '../../hooks/workers'
import { styled } from 'styled-components'

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
          <ButtonPrimary href={addParams(routes.workers.add, { node: item?.id.toString() })}>
            Add Worker
          </ButtonPrimary>
          {/*{data?.length === 0 && (*/}
          {/*  <ButtonPrimary href={addParams(routes.workers.import, { node: item?.id.toString() })}>*/}
          {/*    Import Worker*/}
          {/*  </ButtonPrimary>*/}
          {/*)}*/}
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

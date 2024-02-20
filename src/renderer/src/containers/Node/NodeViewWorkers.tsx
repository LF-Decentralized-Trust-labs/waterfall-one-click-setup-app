import React from 'react'
import { NodeViewTabProps, NodesWorkersDataFields } from '@renderer/types/node'
import { TabContent } from '@renderer/ui-kit/Tabs'
import { Flex } from 'antd'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { NodesWorkersTable } from '@renderer/components/Node/NodeWorkersTable/Table'

const data = [
  {
    key: 1,
    [NodesWorkersDataFields.id]: '1',
    [NodesWorkersDataFields.status]: 'test',
    [NodesWorkersDataFields.workedHours]: 5,
    [NodesWorkersDataFields.actions]: '-',
    [NodesWorkersDataFields.deposit]: {
      data: '555',
      id: '1'
    }
  },
  {
    key: 2,
    [NodesWorkersDataFields.id]: '2',
    [NodesWorkersDataFields.status]: '-',
    [NodesWorkersDataFields.workedHours]: 0,
    [NodesWorkersDataFields.actions]: '-',
    [NodesWorkersDataFields.deposit]: {
      data: null,
      id: '2'
    }
  }
]

export const NodeViewWorkers: React.FC<NodeViewTabProps> = () => {
  const generateFn = () => alert('generate function')

  return (
    <TabContent>
      <Flex align="center" justify="flex-end" gap={10}>
        <ButtonPrimary>Add Worker</ButtonPrimary>
        <ButtonPrimary>Import Worker</ButtonPrimary>
      </Flex>
      <NodesWorkersTable data={data} generate={generateFn} />
    </TabContent>
  )
}

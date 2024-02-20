import { Flex, TableColumnsType } from 'antd'
import { NodesWorkersDataFields, NodesWorkersDataTypes } from '@renderer/types/node'
import { ButtonPrimary } from '@renderer/ui-kit/Button'

export type DataType = NodesWorkersDataTypes & {
  key: React.Key
}

export const columns = (generateFN: (id?: string) => void): TableColumnsType<DataType> => [
  { title: 'Worker ID', dataIndex: NodesWorkersDataFields.id, key: NodesWorkersDataFields.id },
  {
    title: 'Status',
    dataIndex: NodesWorkersDataFields.status,
    key: NodesWorkersDataFields.status
  },
  {
    title: 'Worked Hours',
    dataIndex: NodesWorkersDataFields.workedHours,
    key: NodesWorkersDataFields.workedHours
  },

  {
    title: 'Actions',
    dataIndex: NodesWorkersDataFields.actions,
    key: NodesWorkersDataFields.actions
  },
  {
    title: 'Deposit Data',
    dataIndex: NodesWorkersDataFields.deposit,
    key: NodesWorkersDataFields.deposit,
    render: ({ data, id }) => {
      if (data) return <>{data}</>

      const onClick = () => generateFN(id)
      return <ButtonPrimary onClick={onClick}>Generate</ButtonPrimary>
    }
  }
]

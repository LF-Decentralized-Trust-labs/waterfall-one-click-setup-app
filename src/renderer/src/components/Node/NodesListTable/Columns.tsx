import { TableColumnsType } from 'antd'
import { NodesListDataTypes, NodesListDataFields } from '@renderer/types/node'
import { getDateTime } from '@renderer/helpers/date'

export type DataType = NodesListDataTypes & {
  key: React.Key
}

export const columns: TableColumnsType<DataType> = [
  { title: '#', dataIndex: NodesListDataFields.id, key: NodesListDataFields.id },
  { title: 'Name', dataIndex: NodesListDataFields.name, key: NodesListDataFields.name },
  {
    title: 'Type',
    dataIndex: NodesListDataFields.type,
    key: NodesListDataFields.type
  },
  {
    title: 'Location',
    dataIndex: NodesListDataFields.locationDir,
    key: NodesListDataFields.locationDir
  },

  {
    title: 'Workers',
    dataIndex: NodesListDataFields.workersCount,
    key: NodesListDataFields.workersCount
  },
  {
    title: 'Added',
    dataIndex: NodesListDataFields.createdAt,
    key: NodesListDataFields.createdAt,
    render: (field) => getDateTime(field)
  }
]

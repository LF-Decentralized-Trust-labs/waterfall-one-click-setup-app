import { TableColumnsType } from 'antd'
import { NodesListDataTypes, NodesListDataFields, Node } from '@renderer/types/node'
import { getDateTime } from '@renderer/helpers/date'
import { getNodeStatus } from '@renderer/helpers/node'

export type DataType = Node &
  NodesListDataTypes & {
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
    title: 'Status',
    dataIndex: NodesListDataFields.status,
    key: NodesListDataFields.status,
    render: (_, node) => getNodeStatus(node)
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

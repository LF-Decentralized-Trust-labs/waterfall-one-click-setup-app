import { TableColumnsType } from 'antd'
import { NodesListDataTypes, NodesListDataFields } from '@renderer/types/node'
import { routes } from '@renderer/constants/navigation'
import { getViewLink } from '@renderer/helpers/navigation'
import { Link } from '@renderer/ui-kit/Link'

export type DataType = NodesListDataTypes & {
  key: React.Key
}

export const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: NodesListDataFields.name, key: NodesListDataFields.name },
  {
    title: 'Local/IP',
    dataIndex: NodesListDataFields.localOrIp,
    key: NodesListDataFields.localOrIp
  },
  { title: 'Up Time', dataIndex: NodesListDataFields.upTime, key: NodesListDataFields.upTime },

  {
    title: 'Workers#',
    dataIndex: NodesListDataFields.workers,
    key: NodesListDataFields.workers,
    render: (data) => <div>{data?.join(' ')}</div>
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'x',
    render: ({ id }) => <Link to={getViewLink(routes.nodes.view, { id })}>View</Link>
  }
]

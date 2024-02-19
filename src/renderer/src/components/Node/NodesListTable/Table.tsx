import { Table } from '@renderer/ui-kit/Table'
import React from 'react'
import { DataType, columns } from './Columns'

type NodesListTablePropsT = {
  data: DataType[]
}

export const NodesListTable: React.FC<NodesListTablePropsT> = ({ data }) => {
  return <Table dataSource={data} columns={columns} />
}

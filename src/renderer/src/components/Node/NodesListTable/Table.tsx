import { Table, TableProps } from '@renderer/ui-kit/Table'
import React from 'react'
import { DataType, columns } from './Columns'

type NodesListTablePropsT = TableProps & {
  data: DataType[]
  onRowClick: (id: number) => void
}

export const NodesListTable: React.FC<NodesListTablePropsT> = ({ data, onRowClick, ...props }) => {
  const dataSource = data ? data.map((item) => ({ ...item, key: `${item.id}` })) : []
  return (
    <Table
      {...props}
      dataSource={dataSource}
      columns={columns}
      onRow={(record) => ({
        style: {
          cursor: 'pointer'
        },
        onClick: () => {
          onRowClick(record.id)
        }
      })}
    />
  )
}

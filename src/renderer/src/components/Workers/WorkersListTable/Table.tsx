import { Table } from '@renderer/ui-kit/Table'
import React from 'react'
import { columns } from './Columns'
import { ActionTxType, Worker } from '../../../types/workers'

type WorkersListTablePropsT = {
  data: Worker[]
  onRowClick: (id: number) => void
  onAction: (action: null | ActionTxType, workerId: undefined | string) => void
}

export const WorkersListTable: React.FC<WorkersListTablePropsT> = ({
  data,
  onRowClick,
  onAction
}) => {
  const dataSource = data ? data.map((item) => ({ ...item, key: `${item.id}` })) : []
  const onActivate = (id?: string) => onAction(ActionTxType.activate, id)
  const onDeactivate = (id?: string) => onAction(ActionTxType.deActivate, id)
  const onWithdraw = (id?: string) => onAction(ActionTxType.withdraw, id)
  const onRemove = (id?: string) => onAction(ActionTxType.remove, id)

  const getColumns = columns({
    activate: onActivate,
    deactivate: onDeactivate,
    withdraw: onWithdraw,
    remove: onRemove
  })

  return (
    <Table
      dataSource={dataSource}
      columns={getColumns}
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

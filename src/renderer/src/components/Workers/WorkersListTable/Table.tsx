import { Table } from '@renderer/ui-kit/Table'
import React from 'react'
import { columns } from './Columns'
import { ActionTxType, Worker, Status } from '../../../types/workers'
import { getStatus } from '@renderer/helpers/workers'

type WorkersListTablePropsT = {
  data: Worker[]
  onRowClick: (id: number) => void
  onAction: (action: null | ActionTxType, workerId: undefined | string) => void
  onSelect?: (workers: Worker[]) => void
}

export const WorkersListTable: React.FC<WorkersListTablePropsT> = ({
  data,
  onRowClick,
  onAction,
  onSelect
}) => {
  const dataSource = data ? data.map((item) => ({ ...item, key: `${item.id}` })) : []
  const onActivate = (id?: string) => onAction(ActionTxType.activate, id)
  const onDeactivate = (id?: string) => onAction(ActionTxType.deActivate, id)
  const onWithdraw = (id?: string) => onAction(ActionTxType.withdraw, id)
  const onRemove = (id?: string) => onAction(ActionTxType.remove, id)

  const rewardAmount = data.reduce((cur, worker) => {
    const status = getStatus(worker)
    const amount =
      status === Status.active
        ? parseFloat(worker.coordinatorBalanceAmount) - parseFloat(worker.stakeAmount)
        : parseFloat(worker.coordinatorBalanceAmount)
    return cur + amount
  }, 0)

  const getColumns = columns({
    activate: onActivate,
    deactivate: onDeactivate,
    withdraw: onWithdraw,
    remove: onRemove,
    rewardAmount
  })

  const rowSelection = {
    onChange: (_, selectedRows: Worker[]) => {
      onSelect?.(selectedRows)
    }
  }

  return (
    <Table
      dataSource={dataSource}
      columns={getColumns}
      rowSelection={{
        type: 'checkbox',
        ...rowSelection
      }}
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

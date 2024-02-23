import React from 'react'

import { TableColumnsType } from 'antd'
import { Table } from '@renderer/ui-kit/Table'
import { DisplayKeysDataType, DisplayKeysFields } from '@renderer/types/workers'

type DataType = DisplayKeysDataType & {
  key: React.Key
}

const columns = (): TableColumnsType<DataType> => [
  { title: 'Worker #', dataIndex: DisplayKeysFields.id, key: DisplayKeysFields.id },
  {
    title: 'Coordinator public Key',
    dataIndex: DisplayKeysFields.coordinatorKey,
    key: DisplayKeysFields.coordinatorKey
  },
  {
    title: 'Validator public Key',
    dataIndex: DisplayKeysFields.validatorKey,
    key: DisplayKeysFields.validatorKey
  },

  {
    title: 'Withdrawal address',
    dataIndex: DisplayKeysFields.withdrawalAddress,
    key: DisplayKeysFields.withdrawalAddress
  }
]

type WorkerKeysTablePropsT = {
  data: DisplayKeysDataType[]
}

export const WorkerKeysTable: React.FC<WorkerKeysTablePropsT> = ({ data }) => {
  const tableColumns = columns();

  return <Table dataSource={data} columns={tableColumns} />
}

import React from 'react'

import { Flex, Input, QRCode, TableColumnsType } from 'antd'
import { Table } from '@renderer/ui-kit/Table'
import { WorkerTransactionTableFields, WorkerTransactionTableData } from '@renderer/types/workers'
import { render } from 'react-dom'
import { ButtonPrimary, ButtonTextPrimary } from '@renderer/ui-kit/Button'

type DataType = WorkerTransactionTableData & {
  key: React.Key
}

const columns = (copyFN: (value: string) => void): TableColumnsType<DataType> => [
  {
    title: 'Worker ID',
    dataIndex: WorkerTransactionTableFields.id,
    key: WorkerTransactionTableFields.id
  },
  {
    title: 'Deposit address',
    dataIndex: WorkerTransactionTableFields.depositAddress,
    key: WorkerTransactionTableFields.depositAddress,
    render: (value) => {
      const handleCopy = () => copyFN(value)
      return (
        <Flex gap={6}>
          <Input value={value} />
          <ButtonTextPrimary ghost onClick={handleCopy}>
            Copy
          </ButtonTextPrimary>
        </Flex>
      )
    }
  },
  {
    title: 'Hex data',
    dataIndex: WorkerTransactionTableFields.hexData,
    key: WorkerTransactionTableFields.hexData,
    render: (value) => {
      const handleCopy = () => copyFN(value)
      return (
        <Flex gap={6}>
          <Input value={value} />
          <ButtonTextPrimary ghost onClick={handleCopy}>
            Copy
          </ButtonTextPrimary>
        </Flex>
      )
    }
  },

  {
    title: 'Value',
    dataIndex: WorkerTransactionTableFields.value,
    key: WorkerTransactionTableFields.value,
    render: (value) => {
      const handleCopy = () => copyFN(value)
      return (
        <Flex gap={6}>
          <Input value={value} />
          <ButtonTextPrimary ghost onClick={handleCopy}>
            Copy
          </ButtonTextPrimary>
        </Flex>
      )
    }
  },
  {
    title: 'QR',
    dataIndex: WorkerTransactionTableFields.qr,
    key: WorkerTransactionTableFields.qr,
    render: (data) => {
      if (!data) return <ButtonPrimary>Generate QR</ButtonPrimary>
      return <QRCode value={data} />
    }
  }
]

type WorkerKeysTablePropsT = {
  data: DataType[]
}

export const WorkerTransactionTable: React.FC<WorkerKeysTablePropsT> = ({ data }) => {
  const copy = (value: string) => navigator.clipboard.writeText(value)
  const tableColumns = columns(copy)

  return <Table dataSource={data} columns={tableColumns} />
}

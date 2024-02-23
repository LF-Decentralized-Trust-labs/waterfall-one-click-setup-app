import { LeaderBoardTableDataTypes } from '@renderer/types/statistics'
import { Table } from '@renderer/ui-kit/Table'
import { Title } from '@renderer/ui-kit/Typography'
import { Flex } from 'antd'
import React from 'react'
import { styled } from 'styled-components'

type PropsT = {
  allTimeData: LeaderBoardTableDataTypes[]
  singleEpochData: LeaderBoardTableDataTypes[]
}

const columns = [
  { title: '№', dataIndex: 'number', key: 'number' },
  { title: 'index', dataIndex: 'index', key: 'index' },
  { title: 'Balance (WATER)', dataIndex: 'balance', key: 'balance' },
  { title: 'Rewards (WATER)', dataIndex: 'rewards', key: 'rewards' }
]

export const LeaderBoards: React.FC<PropsT> = ({ allTimeData, singleEpochData }) => {
  return (
    <Wrapper justify="space-between">
      <TableView>
        <Title level={5}>All-Time Data</Title>
        <Table dataSource={allTimeData} columns={columns} />
      </TableView>
      <TableView>
        <Title level={5}>Single Epoch Data</Title>
        <Table dataSource={singleEpochData} columns={columns} />
      </TableView>
    </Wrapper>
  )
}

const Wrapper = styled(Flex)``

const TableView = styled.div`
  h5 {
    margin-bottom: 30px;
    text-align: center;
  }
  width: 46%;
  .ant-table-cell {
    text-align: center !important;
  }
`

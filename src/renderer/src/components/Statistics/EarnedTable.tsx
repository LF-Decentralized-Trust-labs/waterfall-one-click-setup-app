import React from 'react'
import { EarnedTableDataTypes } from '@renderer/types/statistics'
import { Title } from '@renderer/ui-kit/Typography'
import { Flex, Table } from 'antd'
import { styled } from 'styled-components'
import { StockOutlined } from '@ant-design/icons'

const columns = [
  { title: 'Day', dataIndex: 'day', key: 'day' },
  { title: 'Week', dataIndex: 'week', key: 'week' },
  { title: 'Month', dataIndex: 'month', key: 'month' },
  { title: 'Year', dataIndex: 'year', key: 'year' }
]

type PropsT = {
  data?: EarnedTableDataTypes[]
}
export const StatisticsEarnedTable: React.FC<PropsT> = ({ data }) => {
  return (
    <Wrapper>
      <Title level={5}>
        <Flex gap={10}>
          <StockOutlined />
          Earned rewards
        </Flex>
      </Title>
      <Table dataSource={data} columns={columns} pagination={false} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .ant-table-cell {
    text-align: center !important;
  }
  .ant-table-content {
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 6px;
  }
  margin-bottom: 25px;
`

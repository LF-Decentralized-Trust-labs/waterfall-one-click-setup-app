import { Table as AntdTable, TableProps } from 'antd'
import React from 'react'
import { styled } from 'styled-components'

export const Table: React.FC<TableProps> = ({ ...props }) => {
  return (
    <TableWrapper>
      <StyledTable {...props} />
    </TableWrapper>
  )
}

const TableWrapper = styled.div`
  .ant-table-thead {
    th {
      background-color: #ececec !important;
    }
  }
  table {
    border: 1px solid #ebeaea;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`
const StyledTable = styled(AntdTable)``

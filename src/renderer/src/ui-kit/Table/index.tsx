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
`
const StyledTable = styled(AntdTable)``

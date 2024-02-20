import { Table } from '@renderer/ui-kit/Table'
import React from 'react'
import { DataType, columns } from './Columns'
import { styled } from 'styled-components'

type NodesListTablePropsT = {
  data: DataType[]
  generate: (id?: string) => void
}

export const NodesWorkersTable: React.FC<NodesListTablePropsT> = ({ data, generate }) => {
  const table_columns = columns(generate)
  return (
    <Wrapper>
      <Table dataSource={data} columns={table_columns} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 30px;
`

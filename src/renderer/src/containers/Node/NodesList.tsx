import { NodesListTable } from '@renderer/components/Node/NodesListTable/Table'

export const NodesList = ({ data, onRowClick }) => {
  return <NodesListTable data={data} onRowClick={onRowClick} />
}

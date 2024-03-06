import { NodesListTable } from '@renderer/components/Node/NodesListTable/Table'

export const NodesList = ({ data, isLoading, onRowClick }) => {
  return <NodesListTable data={data} loading={isLoading} onRowClick={onRowClick} />
}

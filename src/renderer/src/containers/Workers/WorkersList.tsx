import { WorkersListDataFields, WorkersT } from '@renderer/types/workers'
import { WorkersListTable } from '@renderer/components/Workers/WorkersListTable/Table'
import { Empty, Flex } from 'antd'
import { ButtonPrimary } from '@renderer/ui-kit/Button'

type WorkersListPropsT = {
  data?: WorkersT[]
  shouldAddNode?: boolean
}

export const WorkersList: React.FC<WorkersListPropsT> = ({ shouldAddNode, data }) => {
  if (shouldAddNode)
    return (
      <Empty description={<span>Nothing to display here. Please add your first Node</span>}>
        <Flex justify="center">
          <ButtonPrimary>Add Node</ButtonPrimary>
        </Flex>
      </Empty>
    )
  if (!data?.length)
    return (
      <Empty description={<span>Nothing to display here. Please import your workers</span>}></Empty>
    )

  const tableData = data?.map((el) => ({
    key: el.id,
    [WorkersListDataFields.id]: el.id,
    [WorkersListDataFields.node]: el.node,
    [WorkersListDataFields.status]: el.status,
    [WorkersListDataFields.workedHours]: el.workedHours,
    [WorkersListDataFields.actions]: { id: el.id, data: el.depositData }
  }))
  return <WorkersListTable data={tableData} />
}

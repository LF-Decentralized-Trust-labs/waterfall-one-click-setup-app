import { Worker } from '@renderer/types/workers'
import { WorkersListTable } from '@renderer/components/Workers/WorkersListTable/Table'
import { Empty, Flex } from 'antd'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { useGoWorker } from '@renderer/hooks/workers'
import { useState } from 'react'
import { ActionTxType } from '../../types/workers'
import { ActionModal } from './ActionModal'
type WorkersListPropsT = {
  data?: Worker[]
  shouldAddNode?: boolean
}

export const WorkersList: React.FC<WorkersListPropsT> = ({ shouldAddNode, data }) => {
  const { goView } = useGoWorker()
  const [actionModal, setActionModal] = useState<{
    action: null | ActionTxType
    workerId: undefined | string
  }>({ action: null, workerId: undefined })
  const onActionModalChange = (action: null | ActionTxType, workerId: undefined | string) =>
    setActionModal({ action, workerId })

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

  return (
    <>
      <WorkersListTable data={data} onRowClick={goView} onAction={onActionModalChange} />
      <ActionModal
        id={actionModal.workerId}
        type={actionModal.action}
        onClose={() => onActionModalChange(null, undefined)}
      />
    </>
  )
}

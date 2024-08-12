import { Worker } from '@renderer/types/workers'
import { WorkersListTable } from '@renderer/components/Workers/WorkersListTable/Table'
import { Empty, Flex, Popover } from 'antd'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { useGoWorker } from '@renderer/hooks/workers'
import React, { useState } from 'react'
import { ActionTxType } from '../../types/workers'
import { ActionModal } from './ActionModal'
import { MassActionModal } from './MassActionModal'
import { routes } from '@renderer/constants/navigation'
import { IconButton } from '@renderer/ui-kit/Button'
import { Text } from '@renderer/ui-kit/Typography'
import {
  CloseOutlined,
  CaretRightOutlined,
  WalletOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { styled } from 'styled-components'
import { getMassActions } from '../../helpers/workers'

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
  const [massActionModal, setMassActionModal] = useState<{
    action: null | ActionTxType
    workers: Worker[]
  }>({ action: null, workers: [] })

  const onActionModalChange = (action: null | ActionTxType, workerId: undefined | string) =>
    setActionModal({ action, workerId })

  const onMassSelect = (workers: Worker[]) => {
    setMassActionModal((prev) => ({ ...prev, workers }))
  }

  const massActions = getMassActions(massActionModal.workers)

  if (shouldAddNode)
    return (
      <Empty description={<span>Nothing to display here. Please add your first Node</span>}>
        <Flex justify="center">
          <ButtonPrimary href={routes.nodes.create}>Add Node</ButtonPrimary>
        </Flex>
      </Empty>
    )
  if (!data?.length)
    return (
      <Empty description={<span>Nothing to display here. Please add your Validators</span>}></Empty>
    )

  return (
    <>
      <MassAction gap={6}>
        <Popover
          content="Activate the Validator only if the node runs or node from Provider"
          placement="bottom"
        >
          <IconButton
            disabled={!massActions[ActionTxType.activate]}
            icon={<CaretRightOutlined />}
            shape="default"
            size="small"
            onClick={() =>
              setMassActionModal({
                action: ActionTxType.activate,
                workers: massActionModal.workers
              })
            }
          />
        </Popover>
        <Popover
          content="Deactivate the Validator only if the Node runs and syncs or Node from Provider"
          placement="bottom"
        >
          <IconButton
            disabled={!massActions[ActionTxType.deActivate]}
            icon={<CloseOutlined />}
            shape="default"
            size="small"
            onClick={() =>
              setMassActionModal({
                action: ActionTxType.deActivate,
                workers: massActionModal.workers
              })
            }
          />
        </Popover>
        <Popover
          content="Withdraw the Validator only if the Node runs and syncs or Node from Provider"
          placement="bottom"
        >
          <IconButton
            disabled={!massActions[ActionTxType.withdraw]}
            icon={<WalletOutlined />}
            shape="default"
            size="small"
            onClick={() =>
              setMassActionModal({
                action: ActionTxType.withdraw,
                workers: massActionModal.workers
              })
            }
          />
        </Popover>
        <Popover
          content="Delete the Validators only if the node stops or node from Provider"
          placement="bottom"
        >
          <IconButton
            disabled={!massActions[ActionTxType.remove]}
            icon={<DeleteOutlined />}
            shape="default"
            size="small"
            onClick={() =>
              setMassActionModal({ action: ActionTxType.remove, workers: massActionModal.workers })
            }
            danger
          />
        </Popover>
        <Text>Selected: {massActionModal.workers.length}</Text>
      </MassAction>
      <WorkersListTable
        data={data}
        onRowClick={goView}
        onAction={onActionModalChange}
        onSelect={onMassSelect}
      />
      <ActionModal
        id={actionModal.workerId}
        type={actionModal.action}
        onClose={() => onActionModalChange(null, undefined)}
      />
      <MassActionModal
        workers={massActionModal.workers}
        type={massActionModal.action}
        onClose={() => setMassActionModal((prev) => ({ ...prev, action: null }))}
      />
    </>
  )
}

const MassAction = styled(Flex)`
  margin: 20px 0;
`

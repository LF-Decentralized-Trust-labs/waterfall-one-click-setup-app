import { Flex, TableColumnsType, Popover } from 'antd'
import { WorkersListDataFields, WorkersListDataTypes, Worker } from '@renderer/types/workers'
import { IconButton } from '@renderer/ui-kit/Button'
import { CloseOutlined, CaretRightOutlined, WalletOutlined } from '@ant-design/icons'
import { Link } from '@renderer/ui-kit/Link'
import { getViewLink } from '@renderer/helpers/navigation'
import { getStatusLabel } from '@renderer/helpers/workers'
import { routes } from '@renderer/constants/navigation'
import React from 'react'
import { getActions } from '../../../helpers/workers'
import { ActionTxType } from '../../../types/workers'

export type DataType = Worker &
  WorkersListDataTypes & {
    key: React.Key
  }

type getColumnsProps = {
  activate: (id?: string) => void
  deactivate: (id?: string) => void
  withdraw: (id?: string) => void
}

export const columns = ({
  deactivate,
  activate,
  withdraw
}: getColumnsProps): TableColumnsType<DataType> => [
  {
    title: '#',
    dataIndex: WorkersListDataFields.id,
    key: WorkersListDataFields.id
  },
  {
    title: 'Node',
    dataIndex: WorkersListDataFields.node,
    key: WorkersListDataFields.node,
    render: (node) => (
      <Link
        to={getViewLink(routes.nodes.view, { id: node.id })}
        onClick={(e) => e.stopPropagation()}
      >
        {node.name}
      </Link>
    )
  },
  {
    title: 'Status',
    dataIndex: WorkersListDataFields.status,
    key: WorkersListDataFields.status,
    render: (_, worker) => getStatusLabel(worker)
  },

  {
    title: 'Worked hours',
    dataIndex: WorkersListDataFields.workedHours,
    key: WorkersListDataFields.workedHours
  },
  {
    title: 'Actions',
    dataIndex: WorkersListDataFields.actions,
    key: WorkersListDataFields.actions,
    render: (_, worker) => {
      const actions = getActions(worker)
      const onActivate = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation()
        activate?.(worker.id)
      }
      const onDeactivate = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation()
        deactivate?.(worker.id)
      }
      const onWithdraw = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation()
        withdraw?.(worker.id)
      }

      return (
        <Flex gap={30} align="center">
          <Flex gap={6}>
            {actions[ActionTxType.activate] && (
              <Popover content="Activate" placement="bottom">
                <IconButton
                  icon={<CaretRightOutlined />}
                  shape="default"
                  size="small"
                  onClick={onActivate}
                />
              </Popover>
            )}
            {actions[ActionTxType.deActivate] && (
              <Popover content="Deactivate" placement="bottom">
                <IconButton
                  icon={<CloseOutlined />}
                  shape="default"
                  size="small"
                  onClick={onDeactivate}
                />
              </Popover>
            )}
            {actions[ActionTxType.withdraw] && (
              <Popover content="Withdraw" placement="bottom">
                <IconButton
                  icon={<WalletOutlined />}
                  shape="default"
                  size="small"
                  onClick={onWithdraw}
                />
              </Popover>
            )}
          </Flex>
        </Flex>
      )
    }
  }
]

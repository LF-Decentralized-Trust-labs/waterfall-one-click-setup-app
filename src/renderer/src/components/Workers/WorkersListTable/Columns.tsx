import { Flex, TableColumnsType, Popover } from 'antd'
import {
  WorkersListDataFields,
  WorkersListDataTypes,
  Worker,
  Status
} from '@renderer/types/workers'
import { IconButton } from '@renderer/ui-kit/Button'
import {
  CloseOutlined,
  CaretRightOutlined,
  WalletOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { Link } from '@renderer/ui-kit/Link'
import { getViewLink } from '@renderer/helpers/navigation'
import { getStatusLabel, getStatus } from '@renderer/helpers/workers'
import { routes } from '@renderer/constants/navigation'
import React from 'react'
import { getActions } from '../../../helpers/workers'
import { ActionTxType } from '../../../types/workers'
import { getNodeStatus } from '../../../helpers/node'
import { Status as NodeStatus } from '../../../types/node'

export type DataType = Worker &
  WorkersListDataTypes & {
    key: React.Key
  }

type getColumnsProps = {
  activate: (id?: string) => void
  deactivate: (id?: string) => void
  withdraw: (id?: string) => void
  remove: (id?: string) => void
}

export const columns = ({
  deactivate,
  activate,
  withdraw,
  remove
}: getColumnsProps): TableColumnsType<DataType> => [
  {
    title: '#',
    dataIndex: WorkersListDataFields.id,
    key: WorkersListDataFields.id
  },
  {
    title: 'Index',
    dataIndex: WorkersListDataFields.validatorIndex,
    key: WorkersListDataFields.validatorIndex
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
    title: 'Rewards (WATER)',
    dataIndex: WorkersListDataFields.coordinatorBalanceAmount,
    key: WorkersListDataFields.coordinatorBalanceAmount,
    render: (_, worker) => {
      const status = getStatus(worker)
      return (
        status === Status.active
          ? parseFloat(worker.coordinatorBalanceAmount) - parseFloat(worker.stakeAmount)
          : parseFloat(worker.coordinatorBalanceAmount)
      ).toFixed(2)
    }
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

      const onRemove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation()
        remove?.(worker.id)
      }

      return (
        <Flex gap={30} align="center">
          <Flex gap={6}>
            {actions[ActionTxType.activate] && (
              <Popover
                content="Activate the Validator only if the Node runs and syncs or Node from Provider"
                placement="bottom"
              >
                <IconButton
                  disabled={worker?.node && getNodeStatus(worker?.node) !== NodeStatus.running}
                  icon={<CaretRightOutlined />}
                  shape="default"
                  size="small"
                  onClick={onActivate}
                />
              </Popover>
            )}
            {actions[ActionTxType.deActivate] && (
              <Popover
                content="Deactivate the Validator only if the Node runs and syncs or Node from Provider"
                placement="bottom"
              >
                <IconButton
                  disabled={worker?.node && getNodeStatus(worker?.node) !== NodeStatus.running}
                  icon={<CloseOutlined />}
                  shape="default"
                  size="small"
                  onClick={onDeactivate}
                />
              </Popover>
            )}
            {actions[ActionTxType.withdraw] && (
              <Popover
                content="Withdraw the Validator only if the Node runs and syncs or Node from Provider"
                placement="bottom"
              >
                <IconButton
                  disabled={worker?.node && getNodeStatus(worker?.node) !== NodeStatus.running}
                  icon={<WalletOutlined />}
                  shape="default"
                  size="small"
                  onClick={onWithdraw}
                />
              </Popover>
            )}
            <Popover
              content="Delete the Validator only if the node stops or Node from Provider"
              placement="bottom"
            >
              <IconButton
                disabled={!actions[ActionTxType.remove]}
                icon={<DeleteOutlined />}
                shape="default"
                size="small"
                danger
                onClick={onRemove}
              />
            </Popover>
          </Flex>
        </Flex>
      )
    }
  }
]

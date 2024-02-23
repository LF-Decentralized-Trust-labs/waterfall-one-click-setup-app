import { Flex, TableColumnsType } from 'antd'
import { WorkersListDataFields, WorkersListDataTypes } from '@renderer/types/workers'
import { ButtonPrimary, IconButton } from '@renderer/ui-kit/Button'
// import {
//   PauseOutlined,
//   CaretRightOutlined,
//   ReloadOutlined,
//   DeleteOutlined
// } from '@ant-design/icons'
import { CloseOutlined, CaretRightOutlined, WalletOutlined } from '@ant-design/icons'
import { styled } from 'styled-components'
import { Link } from '@renderer/ui-kit/Link'
import { getViewLink } from '@renderer/helpers/navigation'
import { routes } from '@renderer/constants/navigation'

export type DataType = WorkersListDataTypes & {
  key: React.Key
}

type getColumnsProps = {
  generateFN?: (id?: string) => void
  activate: (id?: string) => void
  deactivate: (id?: string) => void
  withdraw: (id?: string) => void
}

export const columns = ({
  generateFN,
  deactivate,
  activate,
  withdraw
}: getColumnsProps): TableColumnsType<DataType> => [
  {
    title: 'Worker #',
    dataIndex: WorkersListDataFields.id,
    key: WorkersListDataFields.id,
    render: (id) => <WorkerLink to={getViewLink(routes.workers.view, { id })}>{id}</WorkerLink>
  },
  {
    title: 'Node',
    dataIndex: WorkersListDataFields.node,
    key: WorkersListDataFields.node
  },
  { title: 'Status', dataIndex: WorkersListDataFields.status, key: WorkersListDataFields.status },

  {
    title: 'Worked hours',
    dataIndex: WorkersListDataFields.workedHours,
    key: WorkersListDataFields.workedHours
  },
  {
    title: 'Actions',
    dataIndex: WorkersListDataFields.actions,
    key: WorkersListDataFields.actions,
    render: ({ data, id }) => {
      const onClick = () => generateFN?.(id)

      if (!data)
        return (
          <GenerateButton onClick={onClick} ghost>
            Generate Deposit Data
          </GenerateButton>
        )

      const onActivate = () => activate?.(id)
      const onDeactivate = () => deactivate?.(id)
      const onWithdraw = () => withdraw?.(id)

      return (
        <Flex gap={30} align="center">
          <Flex gap={6}>
            <IconButton
              icon={<CaretRightOutlined />}
              shape="default"
              size="small"
              onClick={onActivate}
            />
            <IconButton
              icon={<CloseOutlined />}
              shape="default"
              size="small"
              onClick={onDeactivate}
            />
            <IconButton
              icon={<WalletOutlined />}
              shape="default"
              size="small"
              onClick={onWithdraw}
            />
          </Flex>
        </Flex>
      )
    }
  }
]

const GenerateButton = styled(ButtonPrimary)`
  height: 30px;
  font-size: 11px;
  padding: 4px 10px;
`

const WorkerLink = styled(Link)``

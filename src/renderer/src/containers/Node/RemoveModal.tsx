import React from 'react'
import { Checkbox } from 'antd'
import { Modal } from '../../ui-kit/Modal'
import { Alert } from '../../ui-kit/Alert'
import { Title } from '../../ui-kit/Typography'
import { useRemove } from '../../hooks/node'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

type RemoveModalProps = {
  onClose: () => void
  id?: string
}
const okButtonProps = { danger: true }
export const RemoveModal: React.FC<RemoveModalProps> = ({ id, onClose }) => {
  const { status: status, withData, onChangeWithData, onRemove } = useRemove(id)

  if (!id) {
    return null
  }

  const handleClose = () => {
    onClose()
  }

  const handleOk = async () => {
    await onRemove(handleClose)
  }

  const onChange = (e: CheckboxChangeEvent) => onChangeWithData(e.target.checked)

  return (
    <Modal
      title={`Remove Node #${id}`}
      open={!!id}
      confirmLoading={status}
      okButtonProps={okButtonProps}
      okText="Delete"
      onOk={handleOk}
      onCancel={handleClose}
      width={800}
    >
      <div>
        <Alert message="Are you sure you want to remove this worker?" type="error" />

        <Title>
          <Checkbox onChange={onChange} checked={withData}>
            Delete data folder too
          </Checkbox>
        </Title>
      </div>
    </Modal>
  )
}

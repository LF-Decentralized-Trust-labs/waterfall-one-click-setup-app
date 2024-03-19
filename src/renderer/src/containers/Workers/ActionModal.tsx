import React, { useCallback, useState } from 'react'
import { Modal } from '../../ui-kit/Modal'
import { Alert } from '../../ui-kit/Alert'
import { useActionTx } from '../../hooks/workers'
import { useCopy } from '../../hooks/common'
import { Button, Spin, Input, Space } from 'antd'
import { Text } from '@renderer/ui-kit/Typography'
import { styled } from 'styled-components'
import { Flex } from 'antd'
import { ActionTxType } from '../../types/workers'

type ActionModalProps = {
  type: ActionTxType | null
  onClose: () => void
  id?: string
}

const getTitle = (type, id) => {
  if (type === ActionTxType.activate) {
    return `Activate Worker #${id}`
  } else if (type === ActionTxType.deActivate) {
    return `Deactivate Worker #${id}`
  }

  return `Withdraw Worker #${id}`
}
export const ActionModal: React.FC<ActionModalProps> = ({ type, id, onClose }) => {
  const [amount, setAmount] = useState('0')
  const { data, isLoading, error, onUpdate } = useActionTx(type, id)
  const [copyFromStatus, handleFromCopy] = useCopy(data?.from)
  const [copyToStatus, handleToCopy] = useCopy(data?.to)
  const [copyValueStatus, handleValueCopy] = useCopy(data?.value?.toString())
  const [copyDataStatus, handleDataCopy] = useCopy(data?.hexData)

  const handleUpdate = useCallback(() => {
    onUpdate(amount)
  }, [amount])

  if (!type || !id) {
    return null
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)

  const handleClose = () => {
    setAmount('0')
    onClose()
  }

  return (
    <Modal
      title={getTitle(type, id)}
      open={!!type}
      onOk={handleClose}
      onCancel={handleClose}
      width={800}
    >
      {isLoading ? (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      ) : error ? (
        <Alert message={error.message} type="error" />
      ) : (
        <div>
          {type === ActionTxType.withdraw && (
            <TextRow
              label="Amount"
              value={
                <Flex align="center" gap={12}>
                  <Space.Compact>
                    <StyledInput
                      placeholder="Type Amount here"
                      onChange={onChange}
                      value={amount}
                    />
                    <Button type="primary" onClick={handleUpdate}>
                      Update
                    </Button>
                  </Space.Compact>
                </Flex>
              }
            />
          )}

          {(type === ActionTxType.deActivate || type === ActionTxType.withdraw) && (
            <TextRow
              label="From"
              value={data?.from}
              actions={
                <Button type="dashed" onClick={handleFromCopy}>
                  {copyFromStatus ? 'Copied' : 'Copy'}
                </Button>
              }
            />
          )}
          <TextRow
            label="To"
            value={data?.to}
            actions={
              <Button type="dashed" onClick={handleToCopy}>
                {copyToStatus ? 'Copied' : 'Copy'}
              </Button>
            }
          />
          <TextRow
            label="Value"
            value={data?.value?.toString()}
            actions={
              <Button type="dashed" onClick={handleValueCopy}>
                {copyValueStatus ? 'Copied' : 'Copy'}
              </Button>
            }
          />
          <TextRow
            label="Data"
            value={data?.hexData}
            actions={
              <Button type="dashed" onClick={handleDataCopy}>
                {copyDataStatus ? 'Copied' : 'Copy'}
              </Button>
            }
          />
        </div>
      )}
    </Modal>
  )
}

export const TextRow: React.FC<{
  label: string
  value?: string | number | React.ReactNode
  actions?: React.ReactNode
}> = ({ label, value, actions }) => {
  return (
    <TextItem gap={6} align="center">
      <TextLabel>{label}:</TextLabel>
      <TextValue>{value}</TextValue>
      <Actions align="center" justify="center">
        {actions}
      </Actions>
    </TextItem>
  )
}

const TextLabel = styled(Text)`
  min-width: 70px;
`
const TextValue = styled(Text)`
  width: 100%;
`

const TextItem = styled(Flex)`
  margin-bottom: 20px;
`
const StyledInput = styled(Input)`
  width: 100%;
  max-width: 360px;
`
const Actions = styled(Flex)`
  min-width: 80px;
`

import React from 'react'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { WorkerViewTabProps } from '@renderer/types/workers'
import { useCopy } from '../../hooks/common'
import { Button, Flex } from 'antd'
import { Text } from '@renderer/ui-kit/Typography'
export const WorkerViewValidator: React.FC<WorkerViewTabProps> = ({ item }) => {
  const [copyStatus, handleCopy] = useCopy(
    item?.validatorAddress ? `0x${item.validatorAddress}` : undefined
  )
  return (
    <TabContent>
      <TabTextRow
        label="Public Key"
        value={
          <Flex align="center" gap={12}>
            <Text>{item?.validatorAddress ? `0x${item?.validatorAddress}` : '-'}</Text>
            <Button type="dashed" onClick={handleCopy}>
              {copyStatus ? 'Copied' : 'Copy'}
            </Button>
          </Flex>
        }
      />
      <TabTextRow
        label="Current balance"
        value={item ? `${item.validatorBalanceAmount} WATER` : '-'}
      />
      <TabTextRow
        label="Activation Epoch"
        value={item?.validatorActivationEpoch ? item.validatorActivationEpoch : '-'}
      />
      <TabTextRow
        label="Deactivation Epoch"
        value={item?.validatorDeActivationEpoch ? item.validatorDeActivationEpoch : '-'}
      />
      <TabTextRow
        label="Blocks created"
        value={item?.validatorBlockCreationCount ? item.validatorBlockCreationCount : '-'}
      />
    </TabContent>
  )
}

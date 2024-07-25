import React from 'react'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { WorkerViewTabProps } from '@renderer/types/workers'
import { Button, Flex } from 'antd'
import { Text } from '@renderer/ui-kit/Typography'
import { styled } from 'styled-components'
import { useCopy } from '../../hooks/common'

export const WorkerViewCoordinator: React.FC<WorkerViewTabProps> = ({ item }) => {
  const [copyStatus, handleCopy] = useCopy(
    item?.coordinatorPublicKey ? `0x${item.coordinatorPublicKey}` : undefined
  )

  return (
    <TabContent>
      <TabTextRow
        label="Public Key"
        value={
          <Flex align="center" gap={12}>
            <CoordinatorPublicKeyText>
              {item?.coordinatorPublicKey ? `0x${item?.coordinatorPublicKey}` : '-'}
            </CoordinatorPublicKeyText>
            <Button type="dashed" onClick={handleCopy}>
              {copyStatus ? 'Copied' : 'Copy'}
            </Button>
          </Flex>
        }
      />

      <TabTextRow label="Stake size" value={item ? `${item.stakeAmount} WATER` : '-'} />
      <TabTextRow
        label="Current balance"
        value={item ? `${item.coordinatorBalanceAmount} WATER` : '-'}
      />
      <TabTextRow
        label="Activation Epoch"
        value={item?.coordinatorActivationEpoch ? item.coordinatorActivationEpoch : '-'}
      />
      <TabTextRow
        label="Deactivation Epoch"
        value={item?.coordinatorDeActivationEpoch ? item.coordinatorDeActivationEpoch : '-'}
      />
      {/*<TabTextRow*/}
      {/*  label="Blocks created"*/}
      {/*  value={item?.coordinatorBlockCreationCount ? item.coordinatorBlockCreationCount : '-'}*/}
      {/*/>*/}
      {/*<TabTextRow*/}
      {/*  label="Attestations created"*/}
      {/*  value={*/}
      {/*    item?.coordinatorAttestationCreationCount ? item.coordinatorAttestationCreationCount : '-'*/}
      {/*  }*/}
      {/*/>*/}
    </TabContent>
  )
}

const CoordinatorPublicKeyText = styled(Text)`
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

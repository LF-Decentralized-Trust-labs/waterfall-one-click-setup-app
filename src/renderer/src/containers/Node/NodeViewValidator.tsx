import React from 'react'
import { NodeViewTabProps } from '@renderer/types/node'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { getEpochFromSlot } from '@renderer/helpers/network'

export const NodeViewValidator: React.FC<NodeViewTabProps> = ({ item }) => {
  return (
    <TabContent>
      <TabTextRow label="Status" value={item?.validatorStatus} />
      <TabTextRow label="Peers" value={item?.validatorPeersCount} />
      <TabTextRow
        label="Current Slot (Epoch)"
        value={
          item?.validatorHeadSlot
            ? `${item.validatorHeadSlot} (${getEpochFromSlot(item.validatorHeadSlot)})`
            : '-'
        }
      />
      <TabTextRow
        label="Finalized Slot (Epoch)"
        value={
          item?.validatorFinalizedSlot
            ? `item.validatorFinalizedSlot (${getEpochFromSlot(item.validatorFinalizedSlot)})`
            : '-'
        }
      />
      <TabTextRow
        label="Distance"
        value={item?.validatorSyncDistance ? item.validatorSyncDistance.toString() : '-'}
      />
    </TabContent>
  )
}

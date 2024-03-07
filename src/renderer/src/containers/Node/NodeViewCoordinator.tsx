import React from 'react'
import { NodeViewTabProps } from '@renderer/types/node'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { getEpochFromSlot, getSlotFromEpoch } from '@renderer/helpers/network'

export const NodeViewCoordinator: React.FC<NodeViewTabProps> = ({ item }) => {
  return (
    <TabContent>
      <TabTextRow label="Status" value={item?.coordinatorStatus} />
      <TabTextRow label="Peers" value={item?.coordinatorPeersCount} />
      <TabTextRow
        label="Current Slot (Epoch)"
        value={
          item?.coordinatorHeadSlot
            ? `${item.coordinatorHeadSlot} (${getEpochFromSlot(item.coordinatorHeadSlot)})`
            : '-'
        }
      />
      <TabTextRow
        label="Finalized Slot (Epoch)"
        value={
          item?.coordinatorFinalizedEpoch
            ? `${getSlotFromEpoch(item.coordinatorFinalizedEpoch)} (${item.coordinatorFinalizedEpoch})`
            : '-'
        }
      />
      <TabTextRow
        label="Distance"
        value={item?.coordinatorSyncDistance ? item.coordinatorSyncDistance.toString() : '-'}
      />
    </TabContent>
  )
}

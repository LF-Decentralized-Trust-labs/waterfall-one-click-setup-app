import React from 'react'
import { NodeViewTabProps } from '@renderer/types/node'
import { DataFolder } from '@renderer/ui-kit/DataFolder'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'

export const NodeViewValidator: React.FC<NodeViewTabProps> = () => {
  return (
    <TabContent>
      <TabTextRow label="Validator Node Peer Count" />
      <TabTextRow label="Current Slot (Epoch)" value="34" />
      <TabTextRow label="Last Finalized Slot (Epoch)" value="2323" />
      <TabTextRow label="Number of Slots Until Full Synchronization" value="222" />
    </TabContent>
  )
}

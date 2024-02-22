import React from 'react'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { WorkerViewTabProps } from '@renderer/types/workers'

export const WorkerViewCoordinator: React.FC<WorkerViewTabProps> = () => {
  return (
    <TabContent>
      <TabTextRow label="Public Key" value="0xDccA352601a464e8d629A2E8CFBa9C1a27612751" />
      <TabTextRow label="Stake size" value="34123" />
      <TabTextRow label="Current balance" value="0.000000000131313" />
      <TabTextRow label="Activation epoch" value="1" />
      <TabTextRow label="Deactivation epoch" value="2" />
      <TabTextRow label="Blocks created" value="10" />
      <TabTextRow label="Attestations created" value="9" />
    </TabContent>
  )
}

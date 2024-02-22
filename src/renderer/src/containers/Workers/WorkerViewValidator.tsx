import React from 'react'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { WorkerViewTabProps } from '@renderer/types/workers'

export const WorkerViewValidator: React.FC<WorkerViewTabProps> = () => {
  return (
    <TabContent>
      <TabTextRow label="Public key" value="0xDccA352601a464e8d629A2E8CFBa9C1a27612751" />
      <TabTextRow label="Current balance" value="0.000000000131313" />
      <TabTextRow label="Activation era" value="1" />
      <TabTextRow label="Deactivation era" value="2" />
      <TabTextRow label="Blocks created" value="10" />
    </TabContent>
  )
}

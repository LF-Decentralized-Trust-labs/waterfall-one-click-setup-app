import React from 'react'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { Button, Flex } from 'antd'
import { Text } from '@renderer/ui-kit/Typography'
import { WorkerViewTabProps } from '@renderer/types/workers'

export const WorkerViewInformation: React.FC<WorkerViewTabProps> = () => {
  return (
    <TabContent>
      <TabTextRow label="Location" value="Local/IP" />
      <TabTextRow label="Status" value="status in status bar" />
      <TabTextRow label="Worked time" value="12:34:23" />
      <TabTextRow
        label="Withdrawal address"
        value={
          <Flex align='center' gap={12}>
            <Text>0xDccA352601a464e8d629A2E8CFBa9C1a27612751</Text>
            <Button type="dashed">Copy</Button>
          </Flex>
        }
      />
      <TabTextRow label="Potential future rewards" value="Per Year/Day/Epoch" />
      <TabTextRow label="Earned Rewards" value="Day, Week, Month, Year" />
    </TabContent>
  )
}

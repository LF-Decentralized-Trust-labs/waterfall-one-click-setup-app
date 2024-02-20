import { NodeViewTabProps } from '@renderer/types/node'
import { DataFolder } from '@renderer/ui-kit/DataFolder'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import React from 'react'

export const NodeViewInformation: React.FC<NodeViewTabProps> = () => {
  return (
    <TabContent>
      <TabTextRow label="Location" value="Local/IP" />
      <TabTextRow label="Data Folder" value={<DataFolder value="" hideLabel />} />
      <TabTextRow label="Status" value="status in status bar" />
      <TabTextRow label="Worked time" value="12:34:23" />
      <TabTextRow label="Workers" value="12" />
    </TabContent>
  )
}

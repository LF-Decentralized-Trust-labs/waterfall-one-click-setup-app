import React from 'react'
import { NodeViewTabProps } from '@renderer/types/node'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { getDateTime } from '@renderer/helpers/date'
import { getNodeStatusLabel } from '@renderer/helpers/node'

export const NodeViewInformation: React.FC<NodeViewTabProps> = ({ item }) => {
  return (
    <TabContent>
      <TabTextRow label="ID" value={item?.id ? item?.id.toString() : '-'} />
      <TabTextRow label="Name" value={item?.name} />
      <TabTextRow label="Status" value={item ? getNodeStatusLabel(item) : 'unknown'} />
      <TabTextRow label="Type" value={item?.type} />
      <TabTextRow label="Network" value={item?.network} />
      <TabTextRow label="Location" value={item?.locationDir} />
      <TabTextRow label="Last Validator Index" value={item?.workersCount} />
      <TabTextRow label="Added" value={item?.createdAt ? getDateTime(item.createdAt) : '-'} />
    </TabContent>
  )
}

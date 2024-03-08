import React from 'react'
import { NodeViewTabProps } from '@renderer/types/node'
import { TabContent, TabTextRow } from '@renderer/ui-kit/Tabs'
import { getDateTime } from '@renderer/helpers/date'

export const NodeViewInformation: React.FC<NodeViewTabProps> = ({ item }) => {
  return (
    <TabContent>
      <TabTextRow label="ID" value={item?.id ? item?.id.toString() : '-'} />
      <TabTextRow label="Name" value={item?.name} />
      <TabTextRow label="Type" value={item?.type} />
      <TabTextRow label="Network" value={item?.network} />
      <TabTextRow label="Location" value={item?.locationDir} />
      <TabTextRow label="Workers" value={item?.workersCount} />
      <TabTextRow label="Added" value={item?.createdAt ? getDateTime(item.createdAt) : '-'} />
    </TabContent>
  )
}

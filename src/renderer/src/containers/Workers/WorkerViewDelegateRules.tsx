import React from 'react'
import { TabContent } from '@renderer/ui-kit/Tabs'
import { WorkerViewTabProps } from '@renderer/types/workers'

import { DelegateRules } from '../../components/DelegateRules'
export const WorkerViewDelegateRules: React.FC<WorkerViewTabProps> = ({ item }) => {
  return (
    <TabContent>
      {item && (<DelegateRules delegateRules={item.delegate} />)}
    </TabContent>
  )
}

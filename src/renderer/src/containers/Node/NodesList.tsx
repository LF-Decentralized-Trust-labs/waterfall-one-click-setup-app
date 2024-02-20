import { NodesListDataFields } from '@renderer/types/node'
import { NodesListTable } from '@renderer/components/Node/NodesListTable/Table'

const data = [
  {
    key: 1,
    [NodesListDataFields.name]: 'Test 1',
    [NodesListDataFields.localOrIp]: 'Local',
    [NodesListDataFields.upTime]: new Date().getTime(),
    [NodesListDataFields.workers]: ['20'],
    actions: { id: 1 }
  },
  {
    key: 2,
    [NodesListDataFields.name]: 'Test 2',
    [NodesListDataFields.localOrIp]: 'Local',
    [NodesListDataFields.upTime]: new Date().getTime(),
    [NodesListDataFields.workers]: ['25'],
    actions: { id: 2 }
  },
  {
    key: 3,
    [NodesListDataFields.name]: 'Test 3',
    [NodesListDataFields.localOrIp]: 'Local',
    [NodesListDataFields.upTime]: new Date().getTime(),
    [NodesListDataFields.workers]: ['20'],
    actions: { id: 3 }
  },
  {
    key: 4,
    [NodesListDataFields.name]: 'Test 4',
    [NodesListDataFields.localOrIp]: 'Local',
    [NodesListDataFields.upTime]: new Date().getTime(),
    [NodesListDataFields.workers]: ['25'],
    actions: { id: 4 }
  }
]

export const NodesList = () => {
  return <NodesListTable data={data} />
}

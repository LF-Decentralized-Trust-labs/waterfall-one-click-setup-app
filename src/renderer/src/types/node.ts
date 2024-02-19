export enum NodesListDataFields {
  name = 'name',
  localOrIp = 'localOrIp',
  upTime = 'upTime',
  workers = 'workers'
}

export type NodesListDataTypes = {
  [NodesListDataFields.name]: string
  [NodesListDataFields.localOrIp]: string
  [NodesListDataFields.upTime]: number
  [NodesListDataFields.workers]: string[]
}

export type NodeViewTabProps = {
  id?: string
}
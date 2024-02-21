// NODE LIST TABLE
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

// NODE WORKERS TABLE
export enum NodesWorkersDataFields {
  id = 'id',
  status = 'status',
  workedHours = 'workedHours',
  actions = 'actions',
  deposit = 'deposit'
}

export type NodesWorkersDataTypes = {
  [NodesWorkersDataFields.id]: string
  [NodesWorkersDataFields.status]?: string
  [NodesWorkersDataFields.workedHours]?: number
  [NodesWorkersDataFields.actions]?: string
  [NodesWorkersDataFields.deposit]?: {
    data?: string | null
    id: string
  }
}

export type NodeViewTabProps = {
  id?: string
}

// NODE CREATE

export enum CreateNodeFields {
  network = 'network',
  dataFolder = 'dataFolder',
  name = 'name'
}

export type CreateNodeFormValuesT = {
  [CreateNodeFields.network]: string; 
  [CreateNodeFields.dataFolder]: string; 
  [CreateNodeFields.name]: string; 
}
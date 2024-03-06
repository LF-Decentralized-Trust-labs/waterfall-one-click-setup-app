// NODE LIST TABLE
export enum Type {
  local = 'local',
  remote = 'remote'
}
export enum NodesListDataFields {
  id = 'id',
  name = 'name',
  type = 'type',
  locationDir = 'locationDir',
  createdAt = 'createdAt',
  workersCount = 'workersCount'
}

export type NodesListDataTypes = {
  [NodesListDataFields.id]: number | bigint
  [NodesListDataFields.name]: string
  [NodesListDataFields.type]: Type
  [NodesListDataFields.locationDir]: string
  [NodesListDataFields.createdAt]: string
  [NodesListDataFields.workersCount]: number
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

// NODE ADD

export enum AddNodeFields {
  type = 'type',
  network = 'network',
  dataFolder = 'dataFolder',
  name = 'name'
}

export type AddNodeFormValuesT = {
  [AddNodeFields.network]: string
  [AddNodeFields.dataFolder]: string
  [AddNodeFields.name]: string
}

export enum NODE_TYPE {
  local = 'local',
  remote = 'remote'
}

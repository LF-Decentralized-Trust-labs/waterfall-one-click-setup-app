// NODE LIST TABLE
export enum Network {
  testnet8 = 'testnet8',
  mainnet = 'mainnet'
}
export enum Type {
  local = 'local',
  remote = 'remote'
}

export enum Status {
  stopped = 'stopped',
  running = 'running',
  syncing = 'syncing'
}
export enum CoordinatorStatus {
  stopped = 'stopped',
  running = 'running',
  syncing = 'syncing'
}

export enum CoordinatorValidatorStatus {
  stopped = 'stopped',
  running = 'running'
}

export enum ValidatorStatus {
  stopped = 'stopped',
  running = 'running',
  syncing = 'syncing'
}

export interface Node {
  id: number | bigint
  name: string
  network: Network
  type: Type
  locationDir: string
  coordinatorStatus: CoordinatorStatus
  coordinatorPeersCount: number
  coordinatorHeadSlot: bigint
  coordinatorSyncDistance: bigint
  coordinatorPreviousJustifiedEpoch: number
  coordinatorCurrentJustifiedEpoch: number
  coordinatorFinalizedEpoch: number
  coordinatorPid: number
  coordinatorValidatorStatus: CoordinatorValidatorStatus
  coordinatorValidatorPid: number
  validatorStatus: ValidatorStatus
  validatorPeersCount: number
  validatorHeadSlot: bigint
  validatorSyncDistance: bigint
  validatorFinalizedSlot: bigint
  validatorPid: number
  workersCount: number
  coordinatorHttpApiPort: number
  coordinatorHttpValidatorApiPort: number
  coordinatorP2PTcpPort: number
  coordinatorP2PUdpPort: number
  validatorP2PPort: number
  validatorHttpApiPort: number
  validatorWsApiPort: number
  createdAt: string
  updatedAt: string
}

type RequiredNewNodeFields = Pick<Node, 'name' | 'network' | 'type' | 'locationDir'>
type OptionalNewNodeFields = Partial<
  Pick<
    Node,
    | 'coordinatorHttpApiPort'
    | 'coordinatorHttpValidatorApiPort'
    | 'coordinatorP2PTcpPort'
    | 'coordinatorP2PUdpPort'
    | 'validatorP2PPort'
    | 'validatorHttpApiPort'
    | 'validatorWsApiPort'
  >
>
export interface NewNode extends RequiredNewNodeFields, OptionalNewNodeFields {}
export interface UpdateNode extends Partial<Omit<Node, 'id' | 'createdAt' | 'updatedAt'>> {}
export enum NodesListDataFields {
  id = 'id',
  name = 'name',
  type = 'type',
  locationDir = 'locationDir',
  createdAt = 'createdAt',
  workersCount = 'workersCount',
  status = 'status'
}

export type NodesListDataTypes = {
  [NodesListDataFields.id]: number | bigint
  [NodesListDataFields.name]: string
  [NodesListDataFields.type]: Type
  [NodesListDataFields.locationDir]: string
  [NodesListDataFields.createdAt]: string
  [NodesListDataFields.workersCount]: number
  [NodesListDataFields.status]: Status
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
  item?: Node
}

// NODE ADD

export enum AddNodeFields {
  type = 'type',
  network = 'network',
  locationDir = 'locationDir',
  name = 'name'
}

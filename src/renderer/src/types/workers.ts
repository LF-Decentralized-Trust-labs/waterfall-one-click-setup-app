// Worker LIST TABLE
export enum WorkersListDataFields {
  id = 'id',
  node = 'node',
  status = 'status',
  workedHours = 'workedHours',
  actions = 'actions',
}

export type WorkersListDataTypes = {
  [WorkersListDataFields.id]: string
  [WorkersListDataFields.node]: string
  [WorkersListDataFields.status]?: string
  [WorkersListDataFields.workedHours]?: number
  [WorkersListDataFields.actions]?: {
    data?: any;
    id: string
  }
}

export type WorkersT = {
  id: string
  node: string
  status?: string
  workedHours?: number
  depositData?: any;
}

export type WorkerViewTabProps = {
  id?: string
}

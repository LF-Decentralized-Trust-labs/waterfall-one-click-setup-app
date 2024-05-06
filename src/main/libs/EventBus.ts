import { EventEmitter } from 'node:events'

export enum EventName {
  StartDownloadSnapshot = 'StartDownloadSnapshot',
  FinishDownloadSnapshot = 'FinishDownloadSnapshot',
  PauseDownloadSnapshot = 'PauseDownloadSnapshot',
  ResumeDownloadSnapshot = 'ResumeDownloadSnapshot',
  StopDownloadSnapshot = 'StopDownloadSnapshot'
}

export interface Event<T extends EventName, P> {
  type: T
  payload: P
}

export type FinishDownloadSnapshotPayload = {
  nodeId: number
}
export type PauseDownloadSnapshotPayload = {
  nodeId: number
}
export type ResumeDownloadSnapshotPayload = {
  nodeId: number
}
export type StopDownloadSnapshotPayload = null

class EventBus extends EventEmitter {
  public onEvent<T extends EventName, P>(
    type: T,
    listener: (event: Event<T, P>) => void | Promise<void>
  ): this {
    this.on(type, listener)
    return this
  }
  public offEvent<T extends EventName, P>(
    type: T,
    listener: (event: Event<T, P>) => void | Promise<void>
  ): this {
    this.off(type, listener)
    return this
  }

  public emitEvent<T extends EventName, P>(type: T, payload: P) {
    this.emit(type, { type, payload } as Event<T, P>)
  }
}
export default EventBus

import { Worker } from 'node:worker_threads'
import EventBus, { EventName, Event, FinishDownloadSnapshotPayload } from '../../libs/EventBus'
import AppEnv from '../../libs/appEnv'
import workerPath from './worker?modulePath'

export const name = 'status'
class Status {
  private worker: Worker
  private eventBus: EventBus
  constructor(appEnv: AppEnv, eventBus: EventBus) {
    this.worker = new Worker(workerPath, {
      workerData: {
        isPackaged: appEnv.isPackaged,
        appPath: appEnv.appPath,
        userData: appEnv.userData,
        version: appEnv.version
      }
    })
    this.eventBus = eventBus
    this._sendToEventBus = this._sendToEventBus.bind(this)
    this.onListeners()
  }
  private onListeners() {
    this.worker.on('message', this._sendToEventBus)
  }
  private offListeners() {
    this.worker.off('message', this._sendToEventBus)
  }

  private _sendToEventBus(event: Event<EventName, FinishDownloadSnapshotPayload>) {
    this.eventBus.emitEvent(event.type, event.payload)
  }

  public start() {
    this.worker.postMessage({ type: EventName.StartStatusMonitoring, payload: null })
  }
  public async destroy() {
    this.worker.postMessage({ type: EventName.StopStatusMonitoring, payload: null })
    this.offListeners()
    await this.worker.terminate()
  }
}

export default Status

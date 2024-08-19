import { Worker } from 'node:worker_threads'
import EventBus, {
  EventName,
  Event,
  FinishDownloadSnapshotPayload,
  PauseDownloadSnapshotPayload,
  ResumeDownloadSnapshotPayload
} from '../../libs/EventBus'
import AppEnv from '../../libs/appEnv'
import workerPath from './worker?modulePath'

export const name = 'snapshot'
class Snapshot {
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
    this._pauseDownload = this._pauseDownload.bind(this)
    this._resumeDownload = this._resumeDownload.bind(this)
    this.onListeners()
  }
  private onListeners() {
    this.worker.on('message', this._sendToEventBus)

    this.eventBus.onEvent<EventName.PauseDownloadSnapshot, PauseDownloadSnapshotPayload>(
      EventName.PauseDownloadSnapshot,
      this._pauseDownload
    )
    this.eventBus.onEvent<EventName.ResumeDownloadSnapshot, ResumeDownloadSnapshotPayload>(
      EventName.ResumeDownloadSnapshot,
      this._resumeDownload
    )
  }
  private offListeners() {
    this.worker.off('message', this._sendToEventBus)
    this.eventBus.offEvent<EventName.PauseDownloadSnapshot, PauseDownloadSnapshotPayload>(
      EventName.PauseDownloadSnapshot,
      this._pauseDownload
    )
    this.eventBus.offEvent<EventName.ResumeDownloadSnapshot, ResumeDownloadSnapshotPayload>(
      EventName.ResumeDownloadSnapshot,
      this._resumeDownload
    )
  }

  private _sendToEventBus(event: Event<EventName, FinishDownloadSnapshotPayload>) {
    this.eventBus.emitEvent(event.type, event.payload)
  }
  private _pauseDownload(
    payload: Event<EventName.PauseDownloadSnapshot, PauseDownloadSnapshotPayload>
  ) {
    this.worker.postMessage({ type: EventName.PauseDownloadSnapshot, payload })
  }
  private _resumeDownload(
    payload: Event<EventName.ResumeDownloadSnapshot, ResumeDownloadSnapshotPayload>
  ) {
    this.worker.postMessage({ type: EventName.ResumeDownloadSnapshot, payload })
  }

  public start() {
    this.worker.postMessage({ type: EventName.StartDownloadSnapshot, payload: null })
  }
  public async destroy() {
    this.worker.postMessage({ type: EventName.StopDownloadSnapshot, payload: null })
    this.offListeners()
    await this.worker.terminate()
  }
}

export default Snapshot

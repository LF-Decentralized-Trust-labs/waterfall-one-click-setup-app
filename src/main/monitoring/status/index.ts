/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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

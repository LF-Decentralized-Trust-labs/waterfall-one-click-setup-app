import { ElectronAPI } from '@electron-toolkit/preload'
import {NodeApi} from './node'
declare global {
  interface Window {
    electron: ElectronAPI
    node: NodeApi
    platform: "linux" | "mac" | "win" | null
  }
}

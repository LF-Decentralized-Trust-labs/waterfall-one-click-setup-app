import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
    platform: "linux" | "mac" | "win" | null
  }
}

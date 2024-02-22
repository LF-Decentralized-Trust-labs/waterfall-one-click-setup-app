import { ElectronAPI } from '@electron-toolkit/preload'
import { node } from './node'
declare global {
  interface Window {
    electron: ElectronAPI
    node: node
    platform: 'linux' | 'mac' | 'win' | null
  }
}

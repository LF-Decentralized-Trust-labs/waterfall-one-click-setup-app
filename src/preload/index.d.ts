import { ElectronAPI } from '@electron-toolkit/preload'
import { node } from './node'
declare global {
  interface Window {
    electron: ElectronAPI
    node: node
    os: {
      platform: 'linux' | 'mac' | 'win' | null
      homedir: string
      selectDirectory: (defaultPath?: string) => Promise<string | null>
    }
  }
}

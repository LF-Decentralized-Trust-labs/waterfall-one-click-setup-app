import { ElectronAPI } from '@electron-toolkit/preload'
import { node } from './node'
import { worker } from './worker'

declare global {
  interface Window {
    electron: ElectronAPI
    node: node
    worker: worker
    os: {
      platform: 'linux' | 'mac' | 'win' | null
      homedir: string
      selectDirectory: (defaultPath?: string) => Promise<string | null>
      saveTextFile: (text: string, title?: string, fileName?: string) => Promise<boolean>
      openExternal: (url: string) => void
    }
    app: {
      quit: () => void
    }
  }
}

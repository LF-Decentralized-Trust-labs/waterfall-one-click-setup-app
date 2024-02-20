import * as path from 'node:path'
import { platform } from 'node:os'
import { app } from 'electron'

export function getPlatform(): 'linux' | 'mac' | 'win' | null {
  switch (platform()) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return 'linux'
    case 'darwin':
    case 'sunos':
      return 'mac'
    case 'win32':
      return 'win'
    default:
      return null
  }
}

export function getBinariesPath(): string {
  const { isPackaged } = app

  return isPackaged
    ? path.join(process.resourcesPath, './bin')
    : path.join(app.getAppPath(), 'resources', getPlatform()!)
}

// "ffmpeg" is the binary that we want to package
export const gwatPath = path.resolve(path.join(getBinariesPath(), './gwat'))
export const coordinatorBeaconPath = path.resolve(
  path.join(getBinariesPath(), './coordinator-beacon')
)
export const coordinatorValidatorPath = path.resolve(
  path.join(getBinariesPath(), './coordinator-validator')
)

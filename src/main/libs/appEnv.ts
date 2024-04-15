import path from 'node:path'
import { Network } from './env'
import { platform, arch } from 'node:os'

interface Options {
  isPackaged: boolean
  appPath: string
  userData: string
}

class AppEnv {
  public isPackaged = false
  public appPath: string = ''
  public userData: string = ''
  public mainDB: string = ''

  constructor(options: Options) {
    this.isPackaged = options.isPackaged
    this.appPath = options.appPath
    this.userData = options.userData
    this.mainDB = path.join(this.userData, 'wf.db')
  }

  getPlatform(): 'linux' | 'mac' | 'win' | null {
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
  getArch(): 'x64' | 'arm64' | null {
    switch (arch()) {
      case 'arm64':
        return 'arm64'
      case 'x64':
        return 'x64'
      default:
        return null
    }
  }

  getBinariesPath(): string {
    return this.isPackaged
      ? path.join(process.resourcesPath, './bin')
      : path.join(this.appPath, 'resources', 'bin', this.getPlatform()!, this.getArch()!)
  }

  getGenesisPath(): string {
    return this.isPackaged
      ? path.join(process.resourcesPath, './genesis')
      : path.join(this.appPath, 'resources', 'genesis')
  }

  getValidatorBinPath = (network: Network) =>
    path.resolve(path.join(this.getBinariesPath(), `./validator-${network}`))
  getCoordinatorBeaconBinPath = (network: Network) =>
    path.resolve(path.join(this.getBinariesPath(), `./coordinator-beacon-${network}`))
  getCoordinatorValidatorBinPath = (network: Network) =>
    path.resolve(path.join(this.getBinariesPath(), `./coordinator-validator-${network}`))

  getCoordinatorBeaconGenesisPath = (network: Network) =>
    path.resolve(path.join(this.getGenesisPath(), `./coordinator-genesis-${network}.ssz`))

  getValidatorGenesisPath = (network: Network) =>
    path.resolve(path.join(this.getGenesisPath(), `./validator-genesis-${network}.json`))

  getValidatorGenesisDataPath = (network: Network) =>
    path.resolve(path.join(this.getGenesisPath(), `./validator-genesis-data-${network}.json`))

  getValidatorSocket = (num: string) => {
    const platform = this.getPlatform()
    if (platform === 'win') {
      return `\\\\.\\pipe\\wf-${num}.ipc`
    } else {
      return path.resolve(`/tmp/wf-${num}.ipc`)
    }
  }
}

export default AppEnv

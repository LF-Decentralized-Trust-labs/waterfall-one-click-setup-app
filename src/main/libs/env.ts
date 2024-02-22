import { app } from 'electron'
import * as path from 'node:path'
import { platform } from 'node:os'

const ENV = import.meta.env

export enum Network {
  testnet8 = 'testnet8'
}

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

export function getGenesisPath(): string {
  const { isPackaged } = app

  return isPackaged
    ? path.join(process.resourcesPath, './genesis')
    : path.join(app.getAppPath(), 'resources', 'genesis')
}

export const getValidatorBinPath = (network: Network) =>
  path.resolve(path.join(getBinariesPath(), `./validator-${network}`))
export const getCoordinatorBeaconBinPath = (network: Network) =>
  path.resolve(path.join(getBinariesPath(), `./coordinator-beacon-${network}`))
export const getCoordinatorValidatorBinPath = (network: Network) =>
  path.resolve(path.join(getBinariesPath(), `./coordinator-validator-${network}`))

export const getCoordinatorBeaconGenesisPath = (network: Network) =>
  path.resolve(path.join(getGenesisPath(), `./coordinator-genesis-${network}.ssz`))

export const getValidatorGenesisPath = (network: Network) =>
  path.resolve(path.join(getGenesisPath(), `./validator-genesis-${network}.json`))

export const getValidatorGenesisDataPath = (network: Network) =>
  path.resolve(path.join(getGenesisPath(), `./validator-genesis-data-${network}.json`))

export const DEFAULT_DATA_PATH = `${app.getPath('home')}${ENV.VITE_DATA_PATH}`
export const getCoordinatorBootnode = (network: Network): string =>
  ENV[`MAIN_VITE_COORDINATOR_BOOTNODE_${network.toUpperCase()}`]

export const getValidatorBootnode = (network: Network): string =>
  ENV[`MAIN_VITE_VALIDATOR_BOOTNODE_${network.toUpperCase()}`]
export const getChainId = (network: Network): string =>
  ENV[`VITE_CHAIN_ID_${network.toUpperCase()}`]

export const getValidatorAddress = (network: Network): string =>
  ENV[`VITE_VALIDATOR_ADDRESS_${network.toUpperCase()}`]

export const getCoordinatorPath = (path: string): string => `${path}/coordinator`
export const getCoordinatorWalletPath = (path: string): string => `${path}/coordinator/wallet`
export const getValidatorPath = (path: string): string => `${path}/gwat`
export const getLogPath = (path: string): string => `${path}/logs`

export const COORDINATOR_HTTP_API_PORT = ENV.VITE_COORDINATOR_HTTP_API_PORT
export const COORDINATOR_HTTP_VALIDATOR_API_PORT = ENV.VITE_COORDINATOR_HTTP_VALIDATOR_API_PORT
export const COORDINATOR_P2P_TCP_PORT = ENV.VITE_COORDINATOR_P2P_TCP_PORT
export const COORDINATOR_P2P_UDP_PORT = ENV.VITE_COORDINATOR_P2P_UDP_PORT
export const VALIDATOR_P2P_PORT = ENV.VITE_VALIDATOR_P2P_PORT
export const VALIDATOR_HTTP_API_PORT = ENV.VITE_VALIDATOR_HTTP_API_PORT
export const VALIDATOR_WS_API_PORT = ENV.VITE_VALIDATOR_WS_API_PORT

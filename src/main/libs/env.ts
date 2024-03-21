const ENV = import.meta.env

export enum Network {
  testnet8 = 'testnet8',
  mainnet = 'mainnet'
}

export const DATA_PATH = ENV.VITE_DATA_PATH
export const getCoordinatorBootnode = (network: Network): string =>
  ENV[`MAIN_VITE_COORDINATOR_BOOTNODE_${network.toUpperCase()}`]

export const getCoordinatorNetwork = (network: Network): string => {
  if (network === Network.testnet8) {
    return '--testnet8'
  } else if (network === Network.mainnet) {
    return '--mainnet'
  }
  return ''
}

export const getValidatorNetwork = (network: Network): string => {
  if (network === Network.testnet8) {
    return '--testnet8'
  } else if (network === Network.mainnet) {
    return '--mainnet'
  }
  return ''
}

export const getValidatorBootnode = (network: Network): string =>
  ENV[`MAIN_VITE_VALIDATOR_BOOTNODE_${network.toUpperCase()}`]
export const getChainId = (network: Network): string =>
  ENV[`VITE_CHAIN_ID_${network.toUpperCase()}`]

export const getValidatorAddress = (network: Network): string =>
  ENV[`VITE_VALIDATOR_ADDRESS_${network.toUpperCase()}`]

export const getCoordinatorPath = (path: string): string => `${path}/coordinator`
export const getCoordinatorWalletPath = (path: string): string => `${path}/coordinator/wallet`
export const getCoordinatorKeysPath = (path: string): string => `${path}/coordinator/wallet/keys`
export const getValidatorPath = (path: string): string => `${path}/gwat`
export const getLogPath = (path: string): string => `${path}/logs`

export const COORDINATOR_HTTP_API_PORT = ENV.VITE_COORDINATOR_HTTP_API_PORT
export const COORDINATOR_HTTP_VALIDATOR_API_PORT = ENV.VITE_COORDINATOR_HTTP_VALIDATOR_API_PORT
export const COORDINATOR_P2P_TCP_PORT = ENV.VITE_COORDINATOR_P2P_TCP_PORT
export const COORDINATOR_P2P_UDP_PORT = ENV.VITE_COORDINATOR_P2P_UDP_PORT
export const VALIDATOR_P2P_PORT = ENV.VITE_VALIDATOR_P2P_PORT
export const VALIDATOR_HTTP_API_PORT = ENV.VITE_VALIDATOR_HTTP_API_PORT
export const VALIDATOR_WS_API_PORT = ENV.VITE_VALIDATOR_WS_API_PORT

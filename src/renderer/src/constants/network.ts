import { Network } from '@renderer/types/node'

export const NetworkOptions = [
  { value: Network.testnet8, label: 'Testnet8' },
  { value: Network.mainnet, label: 'Mainnet', disabled: true }
]

export const SLOTS_PER_EPOCH = 32

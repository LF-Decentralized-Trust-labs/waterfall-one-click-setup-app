import { Network } from '@renderer/types/node'

export const NetworkOptions = [
  { value: Network.mainnet, label: 'Mainnet', disabled: false },
  { value: Network.testnet8, label: 'Testnet8', disabled: true },
  { value: Network.testnet9, label: 'Testnet9', disabled: true }
]

export const SLOTS_PER_EPOCH = 32

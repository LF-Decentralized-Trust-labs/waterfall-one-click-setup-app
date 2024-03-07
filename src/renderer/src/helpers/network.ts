import { SLOTS_PER_EPOCH } from '../constants/network'

export const getEpochFromSlot = (slots: bigint | number): number => {
  if (typeof slots === 'bigint') {
    return Number(slots / BigInt(SLOTS_PER_EPOCH))
  }
  return Math.floor(slots / SLOTS_PER_EPOCH)
}
export const getSlotFromEpoch = (epoch: number): bigint => BigInt(epoch) * BigInt(SLOTS_PER_EPOCH)

export interface WatInfo {
  cpSlot: number
  currSlot: number
  maxDagSlot: number
}

export function isWatInfo(value: any): value is WatInfo {
  return (
    value &&
    typeof value === 'object' &&
    'cpSlot' in value &&
    'currSlot' in value &&
    'maxDagSlot' in value
  )
}

export interface SyncInfo {
  currentSlot: number
  finalizedSlot: number
}

export function isSyncInfo(value: any): value is SyncInfo {
  return value && typeof value === 'object' && 'currentSlot' in value && 'finalizedSlot' in value
}

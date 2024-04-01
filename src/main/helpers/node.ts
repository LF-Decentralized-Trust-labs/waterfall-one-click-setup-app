export interface SyncInfo {
  cpSlot: number
  currSlot: number
  maxDagSlot: number
}

export function isSyncInfo(value: any): value is SyncInfo {
  return (
    value &&
    typeof value === 'object' &&
    'cpSlot' in value &&
    'currSlot' in value &&
    'maxDagSlot' in value
  )
}

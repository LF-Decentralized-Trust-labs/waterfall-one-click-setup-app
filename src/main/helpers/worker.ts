export interface ValidatorInfo {
  activationEra: number
  address: string
  exitEra: number
  index: number
  pubKey: string
  withdrawalAddress: string
}
export function isValidatorInfo(value: any): value is ValidatorInfo {
  return (
    value &&
    typeof value === 'object' &&
    'activationEra' in value &&
    'address' in value &&
    'exitEra' in value &&
    'index' in value &&
    'pubKey' in value &&
    'withdrawalAddress' in value
  )
}

export interface EraInfo {
  fromEpoch: number
  number: number
  root: string
  toEpoch: number
}

export function isEraInfo(value: any): value is EraInfo {
  return (
    value &&
    typeof value === 'object' &&
    'fromEpoch' in value &&
    'number' in value &&
    'root' in value &&
    'toEpoch' in value
  )
}

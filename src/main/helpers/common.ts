export function areObjectsEqual(obj1: object, obj2: object) {
  const keys1 = Object.keys(obj1)
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }
  return true
}

export function getCurrentDateUTC() {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')
  const hours = String(now.getUTCHours()).padStart(2, '0')
  const minutes = String(now.getUTCMinutes()).padStart(2, '0')
  const seconds = String(now.getUTCSeconds()).padStart(2, '0')
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0')
  const nanosecondsZeros = '000000'
  return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}.${milliseconds}${nanosecondsZeros}Z`
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

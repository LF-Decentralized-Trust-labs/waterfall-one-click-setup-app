export function areObjectsEqual(obj1: object, obj2: object) {
  const keys1 = Object.keys(obj1)
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }
  return true
}

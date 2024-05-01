export interface Condition<T> {
  operation: 'eq' | 'neq' | 'in'
  value: T | T[]
}

export function appendCondition<T>(
  property: string,
  condition: T | Condition<T>,
  conditions: string[],
  params: any[]
) {
  if (condition && typeof condition === 'object' && 'operation' in condition) {
    const { operation, value } = condition
    switch (operation) {
      case 'eq':
        conditions.push(`${property} = ?`)
        params.push(value)
        break
      case 'neq':
        conditions.push(`${property} != ?`)
        params.push(value)
        break
      case 'in':
        if (Array.isArray(value)) {
          conditions.push(`${property} IN (${value.map(() => '?').join(', ')})`)
          params.push(...value)
        }
        break
      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }
  } else {
    conditions.push(`${property} = ?`)
    params.push(condition)
  }
}

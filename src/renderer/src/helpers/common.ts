//eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const isWindows = window?.os?.platform === 'win'

export const shuffleArray = (array: any[]) => {
  return array
    .map((value, index) => ({ value, sort: Math.random(), index }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value, index }) => ({ value, index }))
}

export const isAddress = (address: string): boolean => {
  return /^(0x)?[0-9a-fA-F]{40}$/.test(address)
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const chunkArray = (
  array: (number | bigint)[],
  chunkSize: number
): (number | bigint)[][] => {
  const result: (number | bigint)[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)
    result.push(chunk)
  }
  return result
}

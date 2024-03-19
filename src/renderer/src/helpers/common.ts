//eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const isWindows = window?.electron?.platform === 'win'

export const shuffleArray = (array: any[]) => {
  return array
    .map((value, index) => ({ value, sort: Math.random(), index }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value, index }) => ({ value, index }))
}

export const isAddress = (address: string): boolean => {
  return /^(0x)?[0-9a-fA-F]{40}$/.test(address)
}
